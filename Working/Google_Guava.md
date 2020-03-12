## 滥用Google Guava Cache导致数据异常的问题

- 为何要使用Google Guava Cache

  - 当我们系统中想要获取某个值或者计算出某个值所花费的代价很高，并且该值会被多次用到。

- 实际应用场景

  ![![img](file:///C:/Users/i337040/git/Java_Guide/Working/Resource/ems_integration.png?lastModify=1584005313)ems_integration](./Resource/ems_integration.png)

  - 一个纯后台的API请求发往我们EMS系统update一条数据，数据更新好之后需要把Request Payload发往下游系统。具体发往哪个下游系统是通过我们Communication Channel配置里面的Path和Destination Service来进行配置的。比如发往下游系统1，那么就创建一个Destination destination，里面就配置好下游系统1的地址信息，之后CommunicationChannel再配置好Path 这个field和Destination的名字和地址。这样最终发往下游系统的地址就是Destination 地址做前缀，Path作为后缀来确定的。
  - 但是，在EMS的Communication Channel去获取SAP Cloud Foundry 平台上的Destination Service是比较花费时间的，因为它不是EMS系统内部调用。而且Destination 配置信息一旦配置好，以后不太可能会修改。因此为了基于性能考虑，在这就做了一个Cache，key是CommunicationChannel的Guid，value是Destination的配置信息和CommunicationChannel组合起来的信息。

- 出错原因

  - 我们修改了CommunicationChannel的配置信息以后，并没有及时清除该Guid对应的Destination信息。因此下一次发请求的时候在Cache过期以前，还是走以前的配置路径。所以会有问题。
  - 并且更新CommunicationChannel的代码并没有和发往下游系统的代码在同一个Service里面。更新CommunicationChannel的代码在Integration Service，而发往下游系统的代码在Outbound里面。

- 怎么解决的

  - 引入RabbitMQ，定义好MQ的消息规则，routing key,以及创建好传输数据的Queue。那么在更新CommunicationChannel的时候把CommunicationChannel Guid传入MQ（在Integration Service创建Producer），在Outbound service里面创建Receiver，接收到CommunicationChannel Guid之后，立即让该CommunicationChannel Guid对应的Cache失效。

  ​