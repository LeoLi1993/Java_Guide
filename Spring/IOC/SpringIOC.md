## SpringIOC

### What is IOC

Spring IOC 全名是Inverse Of Control, 控制反转，也称为依赖注入。它是为了降低代码间的耦合度而采用的一种设计思想。原本创建一个对象是由我们手动去创建，现在了，我们只需要维护好对象之间的关系，并把这些对象交给Spring容器去管理，交给容器去创建我们需要的对象。

### Spring Container

org.springframework.context.ApplicationContext代表了Spring IOC容器，并且它负责Spring Beans的初始化，配置以及装配，通过配置的matadata使Spring容器知道需要初始化、配置、装配哪些对象。配置的metadata信息可以通过xml,Java Config以及annotation的形式来表达。

### Java Based Configuration VS Annotation Based Configuration

Java Configuration是使用@Configuration 和 @Bean来实现的，这种方式可以完全脱离xml配置，Spring 3.0以后支持这种方式。

Annotation Based Configuration：还存在xml配置，但是bean的依赖关系是通过注解来实现的。xml配置会覆盖annotation的方式，默认情况下，基于annotation的方式未启用，我们需要在Spring的配置文件中启用他：<context:annotation-config/>

### 注入的两种方式

Setter注入和构造器注入



### Spring 懒加载

```
默认情况下，Spring容器在启动过程中会去创建和配置单例的bean。懒加载及在对象被使用到的时候，容器才回去创建该对象。
在xml配置文件中，可以指定单个bean使用懒加载模式，
  <bean id="lazy" class="com.something.ExpensiveToCreateBean" lazy-init="true"/>
  同样也可以全局配置懒加载模式：
  <beans default-lazy-init="true">
      <!-- no beans will be pre-instantiated... -->
  </beans>
同样也可以在Bean上加上@lazy注释实现Bean的懒加载策略。
注意：当一个懒加载的对象依赖于另外一个非懒加载单例的对象的时候，那么Spring容器在启动的时候就会去创建该懒加载对象，因为必须得满足Singleton对象依赖。
```

### 自动装配

```
什么是自动装配：Spring容器创建一个对象并把该对象注入到依赖对象中，在这个过程中并不需要指定该对象的引用。
4种自动装配模式：
1.no
	没有启用自动装配，通过"ref" attribute手动指定
2.byName
	根据property的name进行装配，看能否找到bean中的name或者id跟property name匹配的，找到的话就进行注入。
3.byType
	找类型一致的bean，匹配上了进行注入。
4.constructor
	通过构造方法进行注入，找构造方法参数匹配的进行注入。
好处： 自动装配可以大大减少属性或者构造函数的需要。
```

### Spring Bean的作用域

```
1.singleton:Spring容器中仅存在一个Bean实例。
2.prototype:每次Spring容器都会new一个新的实例出来。
3.request:每次http请求都会创建一个新的Bean，仅用于 WebApplicationContext 环境。
4.session：同一个 http Session 共享一个 Bean ，不同的 http Session 使用不同的 Bean，仅用于 WebApplicationContext 环境。
5.application：同一个ServletContext共享一个Bean，作用于ApplicationContext环境。
6.websocket：
```

### Spring Bean生命周期回调

Spring Bean生命周期的回调有三种方式：

- 实现Spring的回调接口：InitializingBean和DisposableBean
- 在xml中自定义init(),destory() 方法
  - <bean id="exampleInitBean" class="examples.ExampleBean" init-method="init"/>
  - <bean id="exampleInitBean" class="examples.ExampleBean" destroy-method="cleanup"/>
- 通过注解的方式定义回调方法：@PostConstruct, @PreDestory

@PostConstruct: Spring Bean在初始化的时候调用。

```java
@PostConstruct
public void init()
{
	System.out.println("init...");
}
```

@PreDestory: Spring Bean被销毁的时候调用。

```java
@PreDestroy
public void destroy()
{
   System.out.println("destroy...");
}
```

### Spring Bean生命周期

