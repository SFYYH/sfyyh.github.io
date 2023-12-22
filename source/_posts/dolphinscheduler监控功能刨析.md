---
title: dolphinscheduler监控功能刨析
date: 2023-07-18 09:43:54
categories: "技术"
tags: 
     - "dolphinscheduler"
     - "大数据分析平台"
     - "GitHub"
---
# dolphinscheduler源码分析记录

# Dolphinscheduler-api-1

## MonitorController.java部分

- [x]  任务一：新增功能获取master/work服务器CPU核心数目以及一共磁盘大小，
- [ ]  任务二：分析如何向监控中心API中写入master/work服务器CPU核心数目以及一共磁盘大小，

核心代码部分:

```java
/**
     * master list
     *
     * @param loginUser login user
     * @return master list
     */
    @ApiOperation(value = "listMaster", notes = "MASTER_LIST_NOTES")
    @GetMapping(value = "/masters")
    @ResponseStatus(HttpStatus.OK)
    @ApiException(LIST_MASTERS_ERROR)
    @AccessLogAnnotation(ignoreRequestArgs = "loginUser")
    public Result listMaster(@ApiIgnore @RequestAttribute(value = Constants.SESSION_USER) User loginUser) {
        Map<String, Object> result = monitorService.queryMaster(loginUser);
        return returnDataList(result);
    }
```

MonitorService.java接口功能核心部分

```java
Map<String, Object> queryMaster(User loginUser);
```

MonitorServiceImpl.java接口实现类核心部分

```java
/**
     * query master list
     *
     * @param loginUser login user
     * @return master information list
     */
    @Override
    public Map<String, Object> queryMaster(User loginUser) {
        Map<String, Object> result = new HashMap<>();
        List<Server> masterServers = getServerListFromRegistry(true);
        result.put(Constants.DATA_LIST, masterServers);
        putMsg(result, Status.SUCCESS);

        return result;
    }
```

`result.put(Constants.*DATA_LIST*, masterServers);` 语句中`Constants.*DATA_LIST*`  是前端json里的data数组部分，装入masterServers  

`getServerListFromRegistry(true);`方法

```java
@Override
    public List<Server> getServerListFromRegistry(boolean isMaster) {
        return isMaster
            ? registryClient.getServerList(NodeType.MASTER)
            : registryClient.getServerList(NodeType.WORKER);
    }
```

`registryClient.getServerList(NodeType.*MASTER*)` 获取master节点的服务信息列表

```java
public List<Server> getServerList(NodeType nodeType) {
        Map<String, String> serverMaps = getServerMaps(nodeType, false);
        String parentPath = rootNodePath(nodeType);

        List<Server> serverList = new ArrayList<>();
        for (Map.Entry<String, String> entry : serverMaps.entrySet()) {
            String serverPath = entry.getKey();
            String heartBeatJson = entry.getValue();
            if (StringUtils.isEmpty(heartBeatJson)) {
                logger.error("The heartBeatJson is empty, serverPath: {}", serverPath);
                continue;
            }
            Server server = new Server();
            switch (nodeType) {
                case MASTER:
                    MasterHeartBeat masterHeartBeat = JSONUtils.parseObject(heartBeatJson, MasterHeartBeat.class);
                    server.setCreateTime(new Date(masterHeartBeat.getStartupTime()));
                    server.setLastHeartbeatTime(new Date(masterHeartBeat.getReportTime()));
                    server.setId(masterHeartBeat.getProcessId());
                    server.setCpuCoreCount(masterHeartBeat.getCpuCoreCount());//获取cpu核心数
                    break;
                case WORKER:
                    WorkerHeartBeat workerHeartBeat = JSONUtils.parseObject(heartBeatJson, WorkerHeartBeat.class);
                    server.setCreateTime(new Date(workerHeartBeat.getStartupTime()));
                    server.setLastHeartbeatTime(new Date(workerHeartBeat.getReportTime()));
                    server.setId(workerHeartBeat.getProcessId());
                    break;
            }

            server.setResInfo(heartBeatJson);
            // todo: add host, port in heartBeat Info, so that we don't need to parse this again
            server.setZkDirectory(parentPath + "/" + serverPath);
            // set host and port
            String[] hostAndPort = serverPath.split(COLON);
            String[] hosts = hostAndPort[0].split(DIVISION_STRING);
            // fetch the last one
            server.setHost(hosts[hosts.length - 1]);
            server.setPort(Integer.parseInt(hostAndPort[1]));
            serverList.add(server);
        }
        return serverList;
    }
```

`[MasterHeartBeat`.java](http://MasterHeartBeat.java) master心跳

```java
/*
 * Licensed to the Apache Software Foundation (ASF) under one or more
 * contributor license agreements.  See the NOTICE file distributed with
 * this work for additional information regarding copyright ownership.
 * The ASF licenses this file to You under the Apache License, Version 2.0
 * (the "License"); you may not use this file except in compliance with
 * the License.  You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

package org.apache.dolphinscheduler.common.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class MasterHeartBeat implements HeartBeat {

    private long startupTime;
    private long reportTime;
    private double cpuUsage;
    private double memoryUsage;
    private double loadAverage;
    private double availablePhysicalMemorySize;
    private double maxCpuloadAvg;
    private double reservedMemory;
    private double diskAvailable;
    private int processId;
    // 新增核数
    private int cpuCoreCount;
}
```

我们进一步深入解析

到这里 `getHeartBeat()` 方法这里开始调用最关键的一步.cpuCoreCount(OSUtils.getCPUCoreCount()) 真正的获取master节点核心cup数量