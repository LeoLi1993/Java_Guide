# DDD

- 是什么
  - Domain-Driven-Design 解决快速变化，复杂系统的设计问题而引入的

- 域
  - 类似于一个Student对象
- 域服务
  - 给域提供服务的
- 防腐层
  - 抽象一层出来作为接口，可以有多个实现，这样不用修改原来代码
- 贫血模型
  - Student对象里面只有age&name属性，不具备业务相关的方法
- 充血模型
  - 具备跟自己相关的业务方法
- 项目设计流程
  - ![](./resource/img/project_design/project_design.png)

## 领域驱动边界怎么定义

- 业务角度
  - 通过业务边界进行划分
- 业务模型
  - 