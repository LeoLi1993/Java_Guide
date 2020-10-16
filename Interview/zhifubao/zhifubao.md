# 支付宝面试题

[toc]

- [基础](#基础)
    - [wait和sleep区别](#wait和sleep区别)
    - [hashcode和equals](#hashcode和equals)
    - [CAS，ABA问题如何解决](#CASABA问题如何解决)
    - [ConcurrentHashMap如何实现并发安全的，HashMap好ConcurrentHashMap底层实现](#ConcurrentHashMap如何实现并发安全的HashMap好ConcurrentHashMap底层实现)
    - [volatile关键字理解](#volatile关键字理解)
    - [锁的转换过程，自旋锁是什么，乐观锁，悲观锁是什么以及应用场景](#锁的转换过程自旋锁是什么乐观锁悲观锁是什么以及应用场景)
- [容器](#容器)
- [并发](#并发)
- [JVM](#JVM)
- [Java8新特性](#Java8新特性)
- [缓存](#缓存)
- [数据库](#数据库)
- [消息队列](#消息队列)
- [框架](#框架)
- [系统设计](#系统设计)
- [分布式](#分布式)

## 基础

### wait和sleep区别

- 来自不同的类

    - wait来自java.lang.Object
    - sleep来自java.lang.Thread

- 是否释放锁

    - wait：释放当前持有的锁
    - sleep：不释放锁

- 使用范围

    - wait：wait必须在同步代码块中使用
    - sleep：没有限制

- 搭配使用

    - wait

        - notify：唤醒等待队列中任意一个在此对象监视器上等待的线程

        - notifyAll：唤醒所有在此对象监视器上等待的线程

            

### hashcode和equals

- hashCode：返回一个int整数，用来确定对象在hash表中的索引位置。

- equals：用来比较两个对象的内存地址是否相同

- 为什么要有hashCode方法？

    - 以HashSet为例，HashSet如何做到去重的呢？首先会去判断添加元素hashCode值所在的位置是否已经有元素了，如果有，则再去再去比较两个对象是否equals，如果都相同则进行覆盖操作，没有则添加新的元素。这样做的好处在于减少了equals方法的比较次数，从而提交了程序的执行速度。

        ```java
        
        public V put(K key, V value) {
                return putVal(hash(key), key, value, false, true);
            }
        
        final V putVal(int hash, K key, V value, boolean onlyIfAbsent,
                       boolean evict) {
            Node<K,V>[] tab; Node<K,V> p; int n, i;
            if ((tab = table) == null || (n = tab.length) == 0)
                n = (tab = resize()).length;
            if ((p = tab[i = (n - 1) & hash]) == null)
                tab[i] = newNode(hash, key, value, null);
            else {
                Node<K,V> e; K k;
                if (p.hash == hash &&
                    ((k = p.key) == key || (key != null && key.equals(k))))
                    e = p;
                else if (p instanceof TreeNode)
                    e = ((TreeNode<K,V>)p).putTreeVal(this, tab, hash, key, value);
                else {
                    for (int binCount = 0; ; ++binCount) {
                        if ((e = p.next) == null) {
                            p.next = newNode(hash, key, value, null);
                            if (binCount >= TREEIFY_THRESHOLD - 1) // -1 for 1st
                                treeifyBin(tab, hash);
                            break;
                        }
                        if (e.hash == hash &&
                            ((k = e.key) == key || (key != null && key.equals(k))))
                            break;
                        p = e;
                    }
                }
                if (e != null) { // existing mapping for key
                    V oldValue = e.value;
                    if (!onlyIfAbsent || oldValue == null)
                        e.value = value;
                    afterNodeAccess(e);
                    return oldValue;
                }
            }
            ++modCount;
            if (++size > threshold)
                resize();
            afterNodeInsertion(evict);
            return null;
        }
        ```

- 重写equals方法为什么要重写hashCode方法？

    - 还是以HashSet为例，我们往HashSet里面添加两个Student对象，Student对象里面有age和name两个属性，我们重写其equals方法，认为只要两个对象的age和name相同，那么两个对象必定相同。但是我们没有重写其hashCode方法，那么会有什么问题呢？

    - 这个时候我们往HashSet里面添加两个new出来的相同的Student对象，这个时候由于我们没有重写hashCode方法，因此它会认为是两个不同的对象，因此HashSet里面最终会存放两份相同的对象，那么这种结果跟我们HashSet的设计违背。因此，我们重写equals方法一定得重写hashcode方法。

        ```java
        
        public class Student
        {
            private String name;
            private Long age;
        
            public String getName()
            {
                return name;
            }
        
            public void setName(String name)
            {
                this.name = name;
            }
        
            public Long getAge()
            {
                return age;
            }
        
            public void setAge(Long age)
            {
                this.age = age;
            }
        
            public Student(String name, Long age)
            {
                this.name = name;
                this.age = age;
            }
        
            public Student()
            {
        
            }
        
            @Override
            public String toString()
            {
                return "Student{" + "name='" + name + '\'' + ", age=" + age + '}';
            }
        
            @Override
            public boolean equals(Object o)
            {
                if (this == o)
                    return true;
                if (o == null || getClass() != o.getClass())
                    return false;
                Student student = (Student) o;
                return Objects.equals(name, student.name) && Objects.equals(age, student.age);
            }
        
            @Override
            public int hashCode()
            {
                return Objects.hash(name, age);
            }
        }
        
        public void printStudentCount()
        {
            Student student1 = new Student("Leo", 27L);
            Student student2 = new Student("Leo", 27L);
            Set<Student> set = new HashSet<>();
            set.add(student1);
            set.add(student2);
            System.out.println(set.size());
        }
        ```

- hashCode与equals相关的规定
    - 重写equals方法一定得重写hashCode方法
    - 两个相同的对象他们的hashCode值一定相同
    - hashCode相同的两个对象，他们不一定equals

### CAS，ABA问题如何解决

- CAS含义以及作用：比较和交换，在多线程环境中，用来保证共享资源的原子操作。
    - 3大参数：内存地址，期望的值，目标值；
    - CAS过程：通过内存地址找到当前值，通过比较当前值是否是期望的值，如果是的话，就把当前值更新成目标值，如果不是，则什么也不做。
    - CAS底层实现？
        - 通过调用C++的Atomic::cmpxchg方法，最终调用汇编指令cmpxchg执行相应操作。如果说你的操作系统是多核的话，那么会在汇编指令cmpxchg前加一个lock前缀，加了lock前缀之后，能够确保内存中的读写操作具备原子性。
    - 在哪里用到？
        - JUC包下，AtomicInteger.incrementAndGet()
- ABA问题是什么
    - 内存地址中的值原来是A，经过其他线程修改成B，最终又修改成A。这个时候CAS认为该内存地址的值没有被修改过，因此还是会执行CAS操作。实际上我们知道该内存地址的值有被修改过。
- 如何解决？
    - JUC 下提供了AtomicStampedReference，它通过变量版本信息保证CAS的正确性。如果说变量的值被修改过，那么它的版本信息也会被修改，只有当变量的值和版本信息同期望的一致，那么CAS才能执行成功。

### ConcurrentHashMap如何实现并发安全的，HashMap好ConcurrentHashMap底层实现



### volatile关键字理解



### 锁的转换过程，自旋锁是什么，乐观锁，悲观锁是什么以及应用场景



## 容器

1.Map迭代器，一个类中多个synchronized方法调用不同方法会出现什么？

2.set怎么判断元素是否重复？

3.list,set,map的使用

4.HashMap中根据某个规则移除参数？HashMap的原理，存取值的原理，算法，时间复杂度？

## 并发

1.创建线程池的几种方法，多线程开发经验和线程池的使用，多线程的使用(结合自己项目中来讲)，线程池核心参数，为什么核心线程数是cpu的倍数，线程池的关键字有哪些，之间的关系是什么？

2.BIO和NIO区别



## JVM

1.JVM内存和分布式内存的优缺点，JVM底层？

2.GC算法有哪些，垃圾回收机制算法了解吗？垃圾收集算法如何实现？

3.full gc怎么处理

## Java8新特性

1.JDK1.8新特性有哪些，哪里实现了NIO？

2.Java8之后的Lambda表达式的本质

## 数据库

1.Mysql事务，事务隔离级别

2.索引

3.Mysql变更（增加，删除，更新）数据的过程，表记录更新语句的原理

4.最左匹配原则

5.数据库select查询优化，数据库中如果查询出一条指定的数据，如果存在对其进行修改，语句如何实现，数据库事务与数据库锁

6.事务管理有哪几种	

## 缓存

1.Redis常见问题

## 消息队列

1.rabbitmq问题

2.Kafka的原理以及如何实现读写的高性能，常见问题解决

## 框架

1.Spring AOP，IOC，BeanFactory和ApplicationContext区别

2.SpringBoot配置方式及实现细节

3.如何使用Spring Bean输出一个Hello World

4.Mybatis如何实现缓存？如何实现分页？使用方式？

## 系统设计

1.大促限流，高并发限流；如果让你实现高并发抢购业务，你会分为几步？前端和后端具体实现，如何保证在不限流的情况下做到？高并发设计的手段？

2.不重复请求的方法有哪些，防重提交如何实现？

3.应用系统解耦的方法

## 分布式

1.分布式集群常见的问题

2.CAP

3.Spring Cloud熔断机制

4.Dubbo，Shiro框架

5.用过哪些rpc框架，微服务rpc的实现过程。分布式rpc为什么需要注册中心？

6.Zookeeper,Consul,Eureka,Nacos各自的特点和区别，那一个更适合作为注册中心