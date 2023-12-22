---
title: 一次对dolphinscheduler的源码分析
date: 2023-07-20 09:05:10
categories: "技术"
tags: 
     - "dolphinscheduler"
     - "大数据分析平台"
     - "GitHub"
---
# dolphinscheduler学习

## **DolphinScheduler 项目结构**

**2.1 结构分析**

![Untitled](images/Untitled.png)

导入项目后，可以看到**其主要核心模块如下：**

| 模块                     | 描述                                                         |
| ------------------------ | ------------------------------------------------------------ |
| dolphinscheduler-alert   | 告警模块，提供 AlertServer 服务。                            |
| dolphinscheduler-api     | web应用模块，提供 ApiServer 服务。                           |
| dolphinscheduler-common  | 通用的常量枚举、工具类、数据结构或者基类                     |
| dolphinscheduler-dao     | 提供数据库访问等操作。                                       |
| dolphinscheduler-remote  | 基于 netty 的客户端、服务端                                  |
| dolphinscheduler-server  | MasterServer 和 WorkerServer 服务                            |
| dolphinscheduler-service | service模块，包含Quartz、Zookeeper、日志客户端访问服务，便于server模块和api模块调用 |
| dolphinscheduler-ui      | 前端模块                                                     |

**2.2 表分析**

dolphinscheduler_ddl.sql及dolphinscheduler_dml.sql

![Untitled](images/Untitled%201.png)

**执行完后，可以在数据库里看到有如下表：**

| 表名                              | 表信息            |
| --------------------------------- | ----------------- |
| t_ds_access_token                 | 访问ds后端的token |
| t_ds_alert                        | 告警信息          |
| t_ds_alertgroup                   | 告警组            |
| t_ds_command                      | 执行命令          |
| t_ds_datasource                   | 数据源            |
| t_ds_error_command（核心表）      | 错误命令          |
| t_ds_process_definition（核心表） | 流程定义          |
| t_ds_process_instance（核心表）   | 流程实例          |
| t_ds_project                      | 项目              |
| t_ds_queue                        | 队列              |
| t_ds_relation_datasource_user     | 用户关联数据源    |
| t_ds_relation_process_instance    | 子流程            |
| t_ds_relation_project_user        | 用户关联项目      |
| t_ds_relation_resources_user      | 用户关联资源      |
| t_ds_relation_udfs_user           | 用户关联UDF函数   |
| t_ds_relation_user_alertgroup     | 用户关联告警组    |
| t_ds_resources                    | 资源文件          |
| t_ds_schedules（核心表）          | 流程定时调度      |
| t_ds_session                      | 用户登录的session |
| t_ds_task_instance（核心表）      | 任务实例          |
| t_ds_tenant                       | 租户              |
| t_ds_udfs                         | UDF资源           |
| t_ds_user                         | 用户              |
| t_ds_version                      | ds版本信息        |

**2.2.1 类关系图 （用户/队列/数据源）**

**DS**

![1](images/image%201.png)

**描述如下：**

- 一个租户下可以有多个用户；
- `t_ds_user`中的`queue`字段存储的是队列表中的`queue_name`信息;
- `t_ds_tenant`下存的是`queue_id`，在流程定义执行过程中，用户队列优先级最高，用户队列为空则采用租户队列；
- `t_ds_datasource`表中的`user_id`字段表示创建该数据源的用户;
- `t_ds_relation_datasource_user`中的`user_id`表示，对数据源有权限的用户。

**2.2.2 类关系图 （项目/资源/告警）**

**DS**

![2](images/image%201.png)

**描述如下：**

- **一个用户可以有多个项目，用户项目授权通过t_ds_relation_project_user表完成project_id和user_id的关系绑定**；
- t_ds_projcet表中的user_id表示创建该项目的用户；
- t_ds_relation_project_user表中的user_id表示对项目有权限的用户；
- t_ds_resources表中的user_id表示创建该资源的用户；
- t_ds_relation_resources_user中的user_id表示对资源有权限的用户；
- t_ds_udfs表中的user_id表示创建该UDF的用户；
- t_ds_relation_udfs_user表中的user_id表示对UDF有权限的用户。

**2.2.3 类关系图 （ 命令/流程/任务）**

**DS**
![3](images/image3.png)

![4](images/image4.png)

**描述如下：**

- **一个项目有多个流程定义，一个流程定义可以生成多个流程实例，一个流程实例可以生成多个任务实例**；
- t_ds_schedulers表存放流程定义的定时调度信息；
- t_ds_relation_process_instance表存放的数据用于处理流程定义中含有子流程的情况，parent_process_instance_id表示含有子流程的主流程实例id，process_instance_id表示子流程实例的id，parent_task_instance_id表示子流程节点的任务实例id，流程实例表和任务实例表分别对应t_ds_process_instance表和t_ds_task_instance表

**03**

**DolphinScheduler 源码分析**

讲解源码前，先贴一份官网的启动流程图：

![5](images/image5.png)

**3.1 ExecutorController**

**DS**

org.apache.dolphinscheduler.api.controller.ExecutorController

![6 text](images/image6.png)

以下是对各接口的描述：

| 接口                          | 描述                                                      |
| ----------------------------- | --------------------------------------------------------- |
| /start-process-instance       | 执行流程实例                                              |
| /batch-start-process-instance | 批量执行流程实例                                          |
| /execute                      | 操作流程实例，如：暂停, 停止, 重跑, 从暂停恢复,从停止恢复 |
| /batch-execute                | 批量操作流程实例                                          |
| /start-check                  | 检查流程定义或检查所有的子流程定义是否在线                |

接下我们看看最核心的方法：

```java
/**
     * do action to process instance: pause, stop, repeat, recover from pause, recover from stop
     *
     * @param loginUser login user
     * @param projectCode project code
     * @param processInstanceId process instance id
     * @param executeType execute type
     * @return execute result code
     */
    @ApiOperation(value = "execute", notes = "EXECUTE_ACTION_TO_PROCESS_INSTANCE_NOTES")
    @ApiImplicitParams({
            @ApiImplicitParam(name = "processInstanceId", value = "PROCESS_INSTANCE_ID", required = true, dataType = "Int", example = "100"),
            @ApiImplicitParam(name = "executeType", value = "EXECUTE_TYPE", required = true, dataType = "ExecuteType")
    })
    @PostMapping(value = "/execute")
    @ResponseStatus(HttpStatus.OK)
    @ApiException(EXECUTE_PROCESS_INSTANCE_ERROR)
    @AccessLogAnnotation(ignoreRequestArgs = "loginUser")
    public Result execute(@ApiIgnore @RequestAttribute(value = Constants.SESSION_USER) User loginUser,
                          @ApiParam(name = "projectCode", value = "PROJECT_CODE", required = true) @PathVariable long projectCode,
                          @RequestParam("processInstanceId") Integer processInstanceId,
                          @RequestParam("executeType") ExecuteType executeType
    ) {
        Map result = execService.execute(loginUser, projectCode, processInstanceId, executeType);
        return returnDataList(result);
    }

```

可以看到execute接口，是直接使用ExecService去执行了，下面分析下。

**3.2 ExecService**

**DS**

**下面看看里面的execute方法，已经加好了注释：**

```java
/**
 * 操作工作流实例
 *
 * @param loginUser         登录用户
 * @param projectCode       项目编码
 * @param processInstanceId 流程实例ID
 * @param executeType       执行类型（repeat running、resume pause、resume failure、stop、pause）
 * @return 执行结果
 */
@Override
public Map<String, Object> execute(User loginUser, long projectCode, Integer processInstanceId, ExecuteType executeType) {

/*** 查询项目信息 **/
    Project project = projectMapper.queryByCode(projectCode);
//check user access for project

/*** 判断当前用户是否有操作权限 **/
    Map<String, Object> result = projectService.checkProjectAndAuth(loginUser, project, projectCode, ApiFuncIdentificationConstant.map.get(executeType));
    if (result.get(Constants.STATUS) != Status.SUCCESS) {
        return result;
    }

/*** 检查Master节点是否存在 **/
    if (!checkMasterExists(result)) {
        return result;
    }

/*** 查询工作流实例详情 **/
    ProcessInstance processInstance = processService.findProcessInstanceDetailById(processInstanceId);
    if (processInstance == null) {
        putMsg(result, Status.PROCESS_INSTANCE_NOT_EXIST, processInstanceId);
        return result;
    }

/*** 根据工作流实例绑定的流程定义ID查询流程定义 **/
    ProcessDefinition processDefinition = processService.findProcessDefinition(processInstance.getProcessDefinitionCode(),
            processInstance.getProcessDefinitionVersion());
    if (executeType != ExecuteType.STOP && executeType != ExecuteType.PAUSE) {
/*** 校验工作流定义能否执行（工作流是否存在？是否上线状态？存在子工作流定义不是上线状态？） **/
        result = checkProcessDefinitionValid(projectCode, processDefinition, processInstance.getProcessDefinitionCode(), processInstance.getProcessDefinitionVersion());
        if (result.get(Constants.STATUS) != Status.SUCCESS) {
            return result;
        }
    }

/*** 根据当前工作流实例的状态判断能否执行对应executeType类型的操作 **/
    result = checkExecuteType(processInstance, executeType);
    if (result.get(Constants.STATUS) != Status.SUCCESS) {
        return result;
    }

/*** 判断是否已经选择了合适的租户 **/
    if (!checkTenantSuitable(processDefinition)) {
        logger.error("there is not any valid tenant for the process definition: id:{},name:{}, ",
                processDefinition.getId(), processDefinition.getName());
        putMsg(result, Status.TENANT_NOT_SUITABLE);
    }

/*** 在executeType为重跑的状态下，获取用户指定的启动参数 **/
    Map<String, Object> commandMap = JSONUtils.parseObject(processInstance.getCommandParam(), new TypeReference<Map<String, Object>>() {
    });
    String startParams = null;
    if (MapUtils.isNotEmpty(commandMap) && executeType == ExecuteType.REPEAT_RUNNING) {
        Object startParamsJson = commandMap.get(Constants.CMD_PARAM_START_PARAMS);
        if (startParamsJson != null) {
            startParams = startParamsJson.toString();
        }
    }

/*** 根据不同的ExecuteType去执行相应的操作 **/
    switch (executeType) {
        case REPEAT_RUNNING:// 重跑
            result = insertCommand(loginUser, processInstanceId, processDefinition.getCode(), processDefinition.getVersion(), CommandType.REPEAT_RUNNING, startParams);
            break;
        case RECOVER_SUSPENDED_PROCESS:// 恢复挂载的工作流
            result = insertCommand(loginUser, processInstanceId, processDefinition.getCode(), processDefinition.getVersion(), CommandType.RECOVER_SUSPENDED_PROCESS, startParams);
            break;
        case START_FAILURE_TASK_PROCESS:// 启动失败的工作流
            result = insertCommand(loginUser, processInstanceId, processDefinition.getCode(), processDefinition.getVersion(), CommandType.START_FAILURE_TASK_PROCESS, startParams);
            break;
        case STOP:// 停止
            if (processInstance.getState() == ExecutionStatus.READY_STOP) {
                putMsg(result, Status.PROCESS_INSTANCE_ALREADY_CHANGED, processInstance.getName(), processInstance.getState());
            } else {
                result = updateProcessInstancePrepare(processInstance, CommandType.STOP, ExecutionStatus.READY_STOP);
            }
            break;
        case PAUSE:// 暂停
            if (processInstance.getState() == ExecutionStatus.READY_PAUSE) {
                putMsg(result, Status.PROCESS_INSTANCE_ALREADY_CHANGED, processInstance.getName(), processInstance.getState());
            } else {
                result = updateProcessInstancePrepare(processInstance, CommandType.PAUSE, ExecutionStatus.READY_PAUSE);
            }
            break;
        default:
            logger.error("unknown execute type : {}", executeType);
            putMsg(result, Status.REQUEST_PARAMS_NOT_VALID_ERROR, "unknown execute type");

            break;
    }
    return result;
}

```

可以看到，以上代码前半部分主要是做了校验的操作，后半部分是根据执行类型来做不同的操作，**操作主要分为两部分：insertCommand以及updateProcessInstancePrepare**。

[execute执行接口分析](https://www.notion.so/execute-58f6ea28eb7f4d4cb8f6ee64c614f670?pvs=21)

**3.2.1 insertCommand**

**DS**

方法代码如下，**其实主要就是把生成命令并插入t_ds_command（执行命令表）**，插入已经添加好注释：

```java
/**
 * 插入命令（re run, recovery (pause / failure) execution)
 *
 * @param loginUser             登录用户
 * @param instanceId            工作流实例id
 * @param processDefinitionCode 工作流定义id
 * @param processVersion        工作流版本
 * @param commandType           命令类型
 * @return 操作结果
 */
private Map<String, Object> insertCommand(User loginUser, Integer instanceId, long processDefinitionCode, int processVersion, CommandType commandType, String startParams) {
    Map<String, Object> result = new HashMap<>();

/*** 封装启动参数 **/
    Map<String, Object> cmdParam = new HashMap<>();
    cmdParam.put(CMD_PARAM_RECOVER_PROCESS_ID_STRING, instanceId);
    if (!StringUtils.isEmpty(startParams)) {
        cmdParam.put(CMD_PARAM_START_PARAMS, startParams);
    }

    Command command = new Command();
    command.setCommandType(commandType);
    command.setProcessDefinitionCode(processDefinitionCode);
    command.setCommandParam(JSONUtils.toJsonString(cmdParam));
    command.setExecutorId(loginUser.getId());
    command.setProcessDefinitionVersion(processVersion);
    command.setProcessInstanceId(instanceId);

/*** 判断工作流实例是否正在执行 **/
    if (!processService.verifyIsNeedCreateCommand(command)) {
        putMsg(result, Status.PROCESS_INSTANCE_EXECUTING_COMMAND, String.valueOf(processDefinitionCode));
        return result;
    }

/*** 保存命令 **/
    int create = processService.createCommand(command);

    if (create > 0) {
        putMsg(result, Status.SUCCESS);
    } else {
        putMsg(result, Status.EXECUTE_PROCESS_INSTANCE_ERROR);
    }

    return result;
}

```

**3.2.2 updateProcessInstancePrepare**

**DS**

方法代码如下，已经添加注释

```java
/**
 * 准备更新工作流实例的命令类型和状态
 *
 * @param processInstance 工作流实例
 * @param commandType     命令类型
 * @param executionStatus 执行状态
 * @return 更新结果
 */
private Map<String, Object> updateProcessInstancePrepare(ProcessInstance processInstance, CommandType commandType, ExecutionStatus executionStatus) {
    Map<String, Object> result = new HashMap<>();

    processInstance.setCommandType(commandType);
    processInstance.addHistoryCmd(commandType);
    processInstance.setState(executionStatus);
    int update = processService.updateProcessInstance(processInstance);

// 判断流程是否正常
    if (update > 0) {
        StateEventChangeCommand stateEventChangeCommand = new StateEventChangeCommand(
                processInstance.getId(), 0, processInstance.getState(), processInstance.getId(), 0
        );
        Host host = new Host(processInstance.getHost());
        stateEventCallbackService.sendResult(host, stateEventChangeCommand.convert2Command());
        putMsg(result, Status.SUCCESS);
    } else {
        putMsg(result, Status.EXECUTE_PROCESS_INSTANCE_ERROR);
    }
    return result;
}

```

根据流程图，我们可以看到了已经执行了如下红框的代码，也就是把我们的**command已经缓存到了DB。**

接下来需要看看Master的代码。

![Alt 7](images/image7.png)

**3.3 MasterServer**

**DS**

![Alt 8](images/image8.png)
```java
@SpringBootApplication
@ComponentScan("org.apache.dolphinscheduler")
@EnableTransactionManagement
@EnableCaching
public class MasterServer implements IStoppable {
    private static final Logger logger = LoggerFactory.getLogger(MasterServer.class);

    @Autowired
    private SpringApplicationContext springApplicationContext;

    @Autowired
    private MasterRegistryClient masterRegistryClient;

    @Autowired
    private TaskPluginManager taskPluginManager;

    @Autowired
    private MasterSchedulerService masterSchedulerService;

    @Autowired
    private SchedulerApi schedulerApi;

    @Autowired
    private EventExecuteService eventExecuteService;

    @Autowired
    private FailoverExecuteThread failoverExecuteThread;

    @Autowired
    private MasterRPCServer masterRPCServer;

    public static void main(String[] args) {
        Thread.currentThread().setName(Constants.THREAD_NAME_MASTER_SERVER);
        SpringApplication.run(MasterServer.class);
    }

/**
     * 启动 master server
     */
    @PostConstruct
    public void run() throws SchedulerException {

// 初始化 RPC服务
        this.masterRPCServer.start();

//安装任务插件
        this.taskPluginManager.installPlugin();

/*** MasterServer 注册客户端，用于连接到注册表并传递注册表事件。
         * 当主节点启动时，它将在注册中心注册,并调度一个{@link HeartBeatTask}来更新注册表中的元数据**/
        this.masterRegistryClient.init();
        this.masterRegistryClient.start();
        this.masterRegistryClient.setRegistryStoppable(this);

// 主调度程序线程，该线程将使用来自数据库的命令并触发执行的processInstance。
        this.masterSchedulerService.init();
        this.masterSchedulerService.start();

        this.eventExecuteService.start();
        this.failoverExecuteThread.start();

//这是调度器的接口，包含操作调度任务的方法。
        this.schedulerApi.start();

        Runtime.getRuntime().addShutdownHook(new Thread(() -> {
            if (Stopper.isRunning()) {
                close("MasterServer shutdownHook");
            }
        }));
    }

/**
     * 优雅的关闭方法
     *
     * @param cause 关闭的原因
     */
    public void close(String cause) {

        try {
// set stop signal is true
// execute only once
            if (!Stopper.stop()) {
                logger.warn("MasterServer is already stopped, current cause: {}", cause);
                return;
            }

            logger.info("Master server is stopping, current cause : {}", cause);

// thread sleep 3 seconds for thread quietly stop
            ThreadUtils.sleep(Constants.SERVER_CLOSE_WAIT_TIME.toMillis());
// close
            this.schedulerApi.close();
            this.masterSchedulerService.close();
            this.masterRPCServer.close();
            this.masterRegistryClient.closeRegistry();
// close spring Context and will invoke method with @PreDestroy annotation to destroy beans.
// like ServerNodeManager,HostManager,TaskResponseService,CuratorZookeeperClient,etc
            springApplicationContext.close();

            logger.info("MasterServer stopped, current cause: {}", cause);
        } catch (Exception e) {
            logger.error("MasterServer stop failed, current cause: {}", cause, e);
        }
    }

    @Override
    public void stop(String cause) {
        close(cause);
    }
}

```

在run方法里面，可以看到，主要依次执行了：

- **① MasterRPCServer.start()**：启动master的rpc服务；
- **② TaskPluginManager.installPlugin()**：安装任务插件；
- **③ MasterRegistryClient.start()**：向Zookeeper注册MasterServer；
- **④ MasterSchedulerService.start()**：主调度程序线程，该线程将使用来自数据库的命令并触发执行的processInstance。
- **⑤ EventExecuteService.start()**：工作流实例执行情况
- **⑥ FailoverExecuteThread()**：故障转移检测
- **⑦ SchedulerApi.start()**：scheduler接口去操作任务实例

**3.1.1 MasterRPCServer**

**DS**

**Master RPC Server主要用来发送或接收请求给其它系统**。

初始化方法如下：

```java
@PostConstruct
private void init() {
// 初始化远程服务
    NettyServerConfig serverConfig = new NettyServerConfig();
    serverConfig.setListenPort(masterConfig.getListenPort());
    this.nettyRemotingServer = new NettyRemotingServer(serverConfig);
    this.nettyRemotingServer.registerProcessor(CommandType.TASK_EXECUTE_RESPONSE, taskExecuteResponseProcessor);
    this.nettyRemotingServer.registerProcessor(CommandType.TASK_EXECUTE_RUNNING, taskExecuteRunningProcessor);
    this.nettyRemotingServer.registerProcessor(CommandType.TASK_KILL_RESPONSE, taskKillResponseProcessor);
    this.nettyRemotingServer.registerProcessor(CommandType.STATE_EVENT_REQUEST, stateEventProcessor);
    this.nettyRemotingServer.registerProcessor(CommandType.TASK_FORCE_STATE_EVENT_REQUEST, taskEventProcessor);
    this.nettyRemotingServer.registerProcessor(CommandType.TASK_WAKEUP_EVENT_REQUEST, taskEventProcessor);
    this.nettyRemotingServer.registerProcessor(CommandType.CACHE_EXPIRE, cacheProcessor);
    this.nettyRemotingServer.registerProcessor(CommandType.TASK_RECALL, taskRecallProcessor);

// 日志服务
    this.nettyRemotingServer.registerProcessor(CommandType.GET_LOG_BYTES_REQUEST, loggerRequestProcessor);
    this.nettyRemotingServer.registerProcessor(CommandType.ROLL_VIEW_LOG_REQUEST, loggerRequestProcessor);
    this.nettyRemotingServer.registerProcessor(CommandType.VIEW_WHOLE_LOG_REQUEST, loggerRequestProcessor);
    this.nettyRemotingServer.registerProcessor(CommandType.REMOVE_TAK_LOG_REQUEST, loggerRequestProcessor);
    this.nettyRemotingServer.start();
}

```

**3.2.2 TaskPluginManager**

**DS**

![Alt 9](images/image9.png)
![Alt 10](images/image10.png)

![Alt 11](images/image11.png)

## 到此部分源码解析完成

整体流程运行

![Untitled](images/Untitled%202.png)

用户点击WEB界面的启动工作流按钮。

apiserver 封装 commnd 到 db（往 t_ds_command 表中插入一条数据）。

master 扫描到 commad，进行 dga 构建，初始化，将源头 task 提交到 priority 队列中。

taskConsumer 消费队列数据得到 task，选择一台 worker 分配任务。

worker 接收到分配任务的消息启动任务。

worker 返回结果给 master，master 更新任务信息到 db 。

03

DolphinScheduler源码剖析

3.1 apiserver任务执行入口

当用户在前端点击执行任务，则会向海豚调度的接口发送请求，最终由 ExecutorController 的 startProcessInstance 方法来处理请求。

![Untitled](images/Untitled%203.png)

ExecutorController.startProcessInstance() 方法。

最终会往 mysql 表 t_ds_command 插入一条数据，将要运行的工作流信息写入该表。

```java
@PostMapping(value = "start-process-instance")
@ResponseStatus(HttpStatus.OK)
@ApiException(START_PROCESS_INSTANCE_ERROR)
@AccessLogAnnotation(ignoreRequestArgs = "loginUser")
public Result startProcessInstance(@ApiIgnore @RequestAttribute(value = Constants.SESSION_USER) User loginUser,
                                   @ApiParam(name = "projectCode", value = "PROJECT_CODE", required = true) @PathVariable long projectCode,
                                   @RequestParam(value = "processDefinitionCode") long processDefinitionCode,
                                   @RequestParam(value = "scheduleTime") String scheduleTime,
                                   @RequestParam(value = "failureStrategy") FailureStrategy failureStrategy,
                                   @RequestParam(value = "startNodeList", required = false) String startNodeList,
                                   @RequestParam(value = "taskDependType", required = false) TaskDependType taskDependType,
                                   @RequestParam(value = "execType", required = false) CommandType execType,
                                   @RequestParam(value = "warningType") WarningType warningType,
                                   @RequestParam(value = "warningGroupId", required = false, defaultValue = "0") Integer warningGroupId,
                                   @RequestParam(value = "runMode", required = false) RunMode runMode,
                                   @RequestParam(value = "processInstancePriority", required = false) Priority processInstancePriority,
                                   @RequestParam(value = "workerGroup", required = false, defaultValue = "default") String workerGroup,
                                   @RequestParam(value = "environmentCode", required = false, defaultValue = "-1") Long environmentCode,
                                   @RequestParam(value = "timeout", required = false) Integer timeout,
                                   @RequestParam(value = "startParams", required = false) String startParams,
                                   @RequestParam(value = "expectedParallelismNumber", required = false) Integer expectedParallelismNumber,
                                   @RequestParam(value = "dryRun", defaultValue = "0", required = false) int dryRun,
                                   @RequestParam(value = "complementDependentMode", required = false) ComplementDependentMode complementDependentMode) {
 
 
    if (timeout == null) {
        timeout = Constants.MAX_TASK_TIMEOUT;
    }
    Map<String, String> startParamMap = null;
    if (startParams != null) {
        startParamMap = JSONUtils.toMap(startParams);
    }
 
 
    if (complementDependentMode == null) {
        complementDependentMode = ComplementDependentMode.OFF_MODE;
    }
    //生成commnd信息入库
    Map<String, Object> result = execService.execProcessInstance(loginUser, projectCode, processDefinitionCode,
            scheduleTime, execType, failureStrategy,
            startNodeList, taskDependType, warningType, warningGroupId, runMode, processInstancePriority,
            workerGroup, environmentCode, timeout, startParamMap, expectedParallelismNumber, dryRun, complementDependentMode);
    return returnDataList(result);
}
```

3.2 master 调度任务

3.2.1  master启动

DS

MasterServer.run() 方法

启动 master 的工作线程

```java
public void run() throws SchedulerException {
// init rpc server
this.masterRPCServer.start();//启动netty rpc服务，与worker通信使用
// install task plugin
this.taskPluginManager.loadPlugin();//加载taskplugin

// self tolerant
this.masterRegistryClient.init();//加载高可用的一些注册信息
this.masterRegistryClient.start();
this.masterRegistryClient.setRegistryStoppable(this);
//command扫描线程
this.masterSchedulerBootstrap.init();
this.masterSchedulerBootstrap.start();
//事件处理线程
this.eventExecuteService.start();
this.failoverExecuteThread.start();
//定时调度
this.schedulerApi.start();

Runtime.getRuntime().addShutdownHook(new Thread(() -> {
    if (Stopper.isRunning()) {
        close("MasterServer shutdownHook");
    }
}));
}
```

3.2.2 command扫描

DS

MasterSchedulerBootstrap.run()方法

该线程在3.2.1启动，启动之后，进入循环，一直扫描 command 表，查询出 command，然后封装成 processInstants 入库，创建 WorkflowExecuteRunnable (此对象后续很多地方用到) 写入到 workflowEventQueue 中。

```java
public void run() {
    while (Stopper.isRunning()) {
        try {
            // todo: if the workflow event queue is much, we need to handle the back pressure
            boolean isOverload =
                    OSUtils.isOverload(masterConfig.getMaxCpuLoadAvg(), masterConfig.getReservedMemory());
            if (isOverload) {
                MasterServerMetrics.incMasterOverload();
                Thread.sleep(Constants.SLEEP_TIME_MILLIS);
                continue;
            }
            List<Command> commands = findCommands();
            if (CollectionUtils.isEmpty(commands)) {
                // indicate that no command ,sleep for 1s
                Thread.sleep(Constants.SLEEP_TIME_MILLIS);
                continue;
            }
            //将command转换成processInstance,并入库
            List<ProcessInstance> processInstances = command2ProcessInstance(commands);
            if (CollectionUtils.isEmpty(processInstances)) {
                // indicate that the command transform to processInstance error, sleep for 1s
                Thread.sleep(Constants.SLEEP_TIME_MILLIS);
                continue;
            }
            MasterServerMetrics.incMasterConsumeCommand(commands.size());
 
 
            processInstances.forEach(processInstance -> {
                try {
                    LoggerUtils.setWorkflowInstanceIdMDC(processInstance.getId());
                    if (processInstanceExecCacheManager.contains(processInstance.getId())) {
                        logger.error("The workflow instance is already been cached, this case shouldn't be happened");
                    }
                    WorkflowExecuteRunnable workflowRunnable = new WorkflowExecuteRunnable(processInstance,
                            processService,
                            nettyExecutorManager,
                            processAlertManager,
                            masterConfig,
                            stateWheelExecuteThread,
                            curingGlobalParamsService);
                    processInstanceExecCacheManager.cache(processInstance.getId(), workflowRunnable);//processInstanceExecCacheManager设置进cache 被  workflowEventLoop获取
                    workflowEventQueue.addEvent(new WorkflowEvent(WorkflowEventType.START_WORKFLOW,
                            processInstance.getId()));
                } finally {
                    LoggerUtils.removeWorkflowInstanceIdMDC();
                }
            });
        } catch (InterruptedException interruptedException) {
            logger.warn("Master schedule bootstrap interrupted, close the loop", interruptedException);
            Thread.currentThread().interrupt();
            break;
        } catch (Exception e) {
            logger.error("Master schedule workflow error", e);
            // sleep for 1s here to avoid the database down cause the exception boom
            ThreadUtils.sleep(Constants.SLEEP_TIME_MILLIS);
        }
    }
}
```

}
3.2.3 workerFlowEvent消费

DS

在 command 扫描线程中启动了 workflowEventLooper 线程用于消费 workerFlowEvent 。

MasterSchedulerBootstrap.start() 方法

```java
@Override
public synchronized void start() {
    logger.info("Master schedule bootstrap starting..");
    super.start();
    workflowEventLooper.start();//工作流调度线程启动
    logger.info("Master schedule bootstrap started...");
}
```

从workflowEventQueue 拉取 workflowevent 事件，调用 workflowEventHandler 处理该事件。

**WorkflowEventLooper.run()方法**

```java
public void run() {
    WorkflowEvent workflowEvent = null;
    while (Stopper.isRunning()) {
        try {
            workflowEvent = workflowEventQueue.poolEvent();//拉取workflowevent
            LoggerUtils.setWorkflowInstanceIdMDC(workflowEvent.getWorkflowInstanceId());
            logger.info("Workflow event looper receive a workflow event: {}, will handle this", workflowEvent);
            WorkflowEventHandler workflowEventHandler =
                workflowEventHandlerMap.get(workflowEvent.getWorkflowEventType());//获取workflowevent，处理workflowevent事件
            workflowEventHandler.handleWorkflowEvent(workflowEvent);
        } catch (InterruptedException e) {
            logger.warn("WorkflowEventLooper thread is interrupted, will close this loop", e);
            Thread.currentThread().interrupt();
            break;
        } catch (WorkflowEventHandleException workflowEventHandleException) {
            logger.error("Handle workflow event failed, will add this event to event queue again, event: {}",
                workflowEvent, workflowEventHandleException);
            workflowEventQueue.addEvent(workflowEvent);
            ThreadUtils.sleep(Constants.SLEEP_TIME_MILLIS);
        } catch (WorkflowEventHandleError workflowEventHandleError) {
            logger.error("Handle workflow event error, will drop this event, event: {}",
                         workflowEvent,
                         workflowEventHandleError);
        } catch (Exception unknownException) {
            logger.error(
                "Handle workflow event failed, get a unknown exception, will add this event to event queue again, event: {}",
                workflowEvent, unknownException);
            workflowEventQueue.addEvent(workflowEvent);
            ThreadUtils.sleep(Constants.SLEEP_TIME_MILLIS);
        } finally {
            LoggerUtils.removeWorkflowInstanceIdMDC();
        }
    }
}
```

**3.2.4 workerflow事件处理逻辑**

**DS**

因为是START_WORKFLOW类型的所以获取到 WorkflowStartEventHandler.handleWorkflowEvent() 来处理该事件。

该方法中，获取 WorkflowExecuteRunnable ，运行异步任务调用 call 方法。

```java
@Override
public void handleWorkflowEvent(WorkflowEvent workflowEvent) throws WorkflowEventHandleError {
    logger.info("Handle workflow start event, begin to start a workflow, event: {}", workflowEvent);
//获取WorkflowExecuteRunnable 
    WorkflowExecuteRunnable workflowExecuteRunnable =
       processInstanceExecCacheManager.getByProcessInstanceId(workflowEvent.getWorkflowInstanceId());
    if (workflowExecuteRunnable == null) {
        throw new WorkflowEventHandleError(
            "The workflow start event is invalid, cannot find the workflow instance from cache");
    }
    ProcessInstance processInstance = workflowExecuteRunnable.getProcessInstance();
 
 
    ProcessInstanceMetrics.incProcessInstanceSubmit();
   //异步调用call方法执行workflowExecute运行逻辑。
 CompletableFuture<WorkflowSubmitStatue> workflowSubmitFuture =
        CompletableFuture.supplyAsync(workflowExecuteRunnable::call, workflowExecuteThreadPool);
    workflowSubmitFuture.thenAccept(workflowSubmitStatue -> {
        if (WorkflowSubmitStatue.SUCCESS == workflowSubmitStatue) {
            // submit failed will resend the event to workflow event queue
            logger.info("Success submit the workflow instance");//监听返回状态是否成功
            if (processInstance.getTimeout() > 0) {//是否超时
                stateWheelExecuteThread.addProcess4TimeoutCheck(processInstance);
            }
        } else {//出现异常，重试，重新进入队列，调用call方法
            logger.error("Failed to submit the workflow instance, will resend the workflow start event: {}",
                         workflowEvent);
            workflowEventQueue.addEvent(new WorkflowEvent(WorkflowEventType.START_WORKFLOW,
                                                          processInstance.getId()));
        }
    });
}
```

**3.2.5 workerflowRunnable运行逻辑**

**DS**

**WorkflowExecuteRunnable.call()**

- 初始化workerflow的有向无环图。
- 初始化任务调度配置
- 提交源头任务到任务优先级队列中。