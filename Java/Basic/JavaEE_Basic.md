#  JavaEE基础

- [J2EE基础知识](#J2EE基础知识)
    - [Servlet相关知识](#Servlet相关知识)
    - [请求转发和重定向](#请求转发和重定向)
    - [Web容器两个Map](#Web容器两个Map)
    - [Cookie和Session](#Cookie和Session)
    - [Forward和Redirect区别](#Forward和Redirect区别)

## J2EE基础知识

### Servlet相关知识

- 什么是Servlet
    
- Server Applet，是运行在服务器端的代码，程序
    
- Servlet作用
    
- 用来接收用户请求，并根据你的业务需求对请求进行相应处理，之后处理结果返回给用户。
    
- Servlet生命周期

    - 实例化：Web容器加载Servlet并实例化Servlet
    - 初始化：调用init方法对Servelt进行初始化，**只执行一次**
    - 服务：调用service方法，根据你的业务需求做相应处理
    - 销毁：当关闭Web容器时会调用destory来销毁Servelt，**只执行一次**，一般写关闭资源的连接。

- Servlet特征

    - 线程安全性问题：不是线程安全

    - Servlet是单例的

        ```xml
        <?xml version="1.0" encoding="UTF-8"?>
        <web-app xmlns="http://java.sun.com/xml/ns/javaee"
                   xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
                   xsi:schemaLocation="http://java.sun.com/xml/ns/javaee
                http://java.sun.com/xml/ns/javaee/web-app_4_0.xsd"
                   version="4.0">
            <!-- 注册Servlet-->
            <servlet>
                <servlet-name>myServlet</servlet-name>
                <servlet-class>com.sap.SomeServlet</servlet-class>
                <!-- load-on-startup 指明哪一个Servlet优先被创建，值大于等于0，越小优先级越高-->
                <load-on-startup>0</load-on-startup> 
            </servlet>
            <servlet-mapping>
                <servlet-name>myServlet</servlet-name>
                <url-pattern>/myServlet</url-pattern>
            </servlet-mapping>
        </web-app>
        ```

        ```java
        package com.sap;
        
        import javax.servlet.*;
        
        public class SomeServlet implements Servlet
        {
        
            public SomeServlet()
            {
                System.out.println("constructor...");
            }
        
            @Override
            public void init(ServletConfig servletConfig) throws ServletException
            {
                System.out.println("init...");
            }
        
            @Override
            public ServletConfig getServletConfig()
            {
                return null;
            }
        
            @Override
            public void service(ServletRequest servletRequest, ServletResponse servletResponse) throws ServletException
            {
                System.out.println("service...");
            }
        
            @Override
            public String getServletInfo()
            {
                return null;
            }
        
            @Override
            public void destroy()
            {
                System.out.println("destroy...");
            }
        }
        ```

- ServletConfig

    - 就是Web.xml里面**所有Servlet的配置信息**

        ```xml
        <servlet>
            <servlet-name>myServlet</servlet-name>
            <servlet-class>com.sap.SomeServlet</servlet-class>
            <load-on-startup>0</load-on-startup>
            <init-param>
                <param-name>Company</param-name>
                <param-value>SAP</param-value>
            </init-param>
            <init-param>
                <param-name>Address</param-name>
                <param-value>Tian Fu 5th street</param-value>
            </init-param>
        </servlet>
        
        <servlet>
            <servlet-name>Servlet1</servlet-name>
            <servlet-class>com.sap.SomeServlet</servlet-class>
            <load-on-startup>1</load-on-startup>
            <init-param>
                <param-name>Company</param-name>
                <param-value>EMC</param-value>
            </init-param>
            <init-param>
                <param-name>Address</param-name>
                <param-value>Tian Fu 4th street</param-value>
            </init-param>
        </servlet>
        ```

        ```java
        @Override
        public void service(ServletRequest servletRequest, ServletResponse servletResponse) throws ServletException
        {
            System.out.println("service...");
            //每个请求来了，具体交给具体某个servlet进行处理，那么servletName就是当前的Servlet的name
            String servletName = servletConfig.getServletName(); 
            System.out.println("servletName" + servletName);
            //得到web.xml Servlet里面<init-param>的参数信息
            Enumeration<String> names =  servletConfig.getInitParameterNames();
            while(names.hasMoreElements())
            {
                String name = names.nextElement();
                String parameterValue = servletConfig.getInitParameter(name);
                System.out.println("parameterName:" + name);
                System.out.println("parameterValue:" + parameterValue);
            }
        ```

- ServletContext

    - 作用域：

        - 对每个Servlet都生效，一个Web应用对应一个ServeltContext

    - 应用场景

        - 网站的总访问量

            ```xml
            <context-param>
                <param-name>Country</param-name>
                <param-value>China</param-value>
            </context-param>
            ```

    - ![](./resource/img/J2EE/Servlet/ServletContext.png)

### 请求转发和重定向

- 请求转发

    - 服务器内部跳转

    - request数据不会丢失，数据可以在多个页面共享

    - 地址不会变

    - 不可以跳转到其他Web应用

        

- 重定向

    - 服务器外部跳转，客户端行为
    - request数据会丢失，数据不能在多个页面共享
    - 地址栏会发生改变
    - 可以跳转到其他Web应用
    - 可以防止表单的重复提交

- 应用场景

    - 提交表单的场景：重定向
    - 多个Web服务之间跳转：重定向
    - 单个Web服务内部跳转不涉及表单提交：转发

    ![](./resource/img/J2EE/Servlet/dispatch.png)

    ​	![](./resource/img/J2EE/Servlet/redirect.png)

### Web容器两个Map

- Map One:：Web容器启动的时候会创建servlet实例，第一个Map存放的Key是uri，Value是Servlet实例的引用。

- Map Two：Key是uri（除去Ip地址和Port剩下的部分），Value是Servlet的全限定名

- 请求流程：**当用户发送一个请求来的时候，会在第一个Map中找是否有Servlet引用，如果存在直接调用service方法，如果不存在那么回去第二个Map中找，找到之后会创建Servlet实例，最后把创建好的Servlet实例引用添加到第一个Map中。**

    ![](./resource/img/J2EE/Servlet/Servlet_Two_Maps.png)



### Cookie和Session

### Forward和Redirect区别
