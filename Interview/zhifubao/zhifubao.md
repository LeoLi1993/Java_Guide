# 支付宝面试题

[toc]

- [基础](#基础)
    - [wait和sleep区别](#wait和sleep区别)
    - [hashcode和equals](#hashcode和equals)
    - [CAS，ABA问题如何解决](#CASABA问题如何解决)
    - [JMM](#JMM)
    - [volatile关键字理解](#volatile关键字理解)
- [容器](#容器)
    - [ConcurrentHashMap如何实现并发安全的，HashMap和ConcurrentHashMap底层实现](#ConcurrentHashMap如何实现并发安全的HashMap和ConcurrentHashMap底层实现)
- [并发](#并发)
    - [锁的转换过程，自旋锁是什么，乐观锁，悲观锁是什么以及应用场景](#锁的转换过程自旋锁是什么乐观锁悲观锁是什么以及应用场景)
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

    - 以HashSet为例，HashSet如何做到去重的呢？首先会去判断添加元素hashCode值所在的位置是否已经有元素了，如果有，则再去再去比较两个对象的key是否equals，如果都相同则进行覆盖操作，没有则添加新的元素。这样做的好处在于减少了equals方法的比较次数，从而提交了程序的执行速度。

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

### JMM

- 作用：基于CPU缓存模型建立的，用来屏蔽各种硬件和操作系统的内存访问差异，使得Java程序能够在不同平台都能达到一致的并发效果。

- ![](C:\Users\i337040\git\Java_Guide\Interview\zhifubao\resource\img\basic\JMM.png)

- 图解：**共享变量存储在主内存中，每个线程又自己的工作内存，线程的工作内存中保存了主内存共享变量的副本。线程对变量的操作都是在自己的工作内存中，线程不能直接读取主内存的变量。不同线程之间变量值的传递需要通过主内存来实现**

- JMM三大特性：
    - 原子性
    - 可见性
    - 有序性

- JMM8大原子操作

    - read：从主内存读取数据
    - load：将主内存中数据加载到工作内存中
    - use：从工作内存读取数据来计算
    - assign：将计算好的值重新赋值到工作内存中
    - store：将工作内存的数据写入主内存
    - write：将store过去的过去的变量赋值给主内存中的变量
    - lock：将主内存的变量加锁，标识为线程独占
    - unlock：将主内存变量解锁，解锁后其他线程能够锁定该变量

    ```java
    public class VolatileTest
    {
        private static boolean initFlag = false;
    
        public static void main(String[] args) throws InterruptedException
        {
            //线程1：initFlag只要是false，cpu就会一直空转
            new Thread(()->{
                System.out.println("Waiting for data...");
                while(!initFlag)
                {
                }
                System.out.println("Success.");
            },"t1").start();
    
            Thread.sleep(2000);
    
            //线程2把initFlag 设置成true
            new Thread(()->{
                prepareData();
            },"t2").start();
        }
    
        public  static void prepareData()
        {
            System.out.println("Preparing data...");
            initFlag = true;
            System.out.println("Prepared.");
        }
    }
    ```

- JMM缓存不一致问题解决方案

    - 早期通过总线加锁（性能太低）：CPU从主内存读取到数据到高速缓存，会在总线对这个数据加锁，这样其他CPU没法去读或写这份数据，直到当前CPU释放掉锁之后才能去访问数据。这样没有利用到多核CPU并行处理的特性。
    - **MESI缓存一致性协议**：多个CPU从主内存读取到同一份数据，cache line 到各自的高速缓存（工作内存），当其中某个CPU修改了缓存数据，该数据会立刻同步回主内存，其他CPU通过**总线嗅探机制**可以感知到数据变化而将自己缓存里面的数据失效。

    ![](C:\Users\i337040\git\Java_Guide\Interview\zhifubao\resource\img\basic\JMM_automic_operation.png)
    
    ​			![](C:\Users\i337040\git\Java_Guide\Interview\zhifubao\resource\img\basic\cache_line.png)

### volatile关键字理解

- 内存可见
  
    - 底层实现：通过汇编指令lock前缀来实现，当线程的工作内存中修改了本地副本变量的值，新的值会写回主内存，写回主内存的过程中需要加锁(lock)，写完之后在unlock。再通过缓存一致性协议告知其他线程，他们工作内存中相应变量的值已经被修改了，缓存的cache line置为无效。
    
- 防止指令重排

    - 对象的创建过程：

        - 堆内存开辟一块空间，并为其属性赋初值，根据数据类型来
        - 调用构造方法对属性赋真实值
        - 链接：建立引用（引用存储在栈中）

        ```java
        public class M
        {
            private int a = 1;
        }
        ```

    - 如果说对象/变量没有被volatile修饰，那么对象的创建过程，上面提到的后两个指令会重排。也就是m已经建立好了引用，但是并没有被初始化完成。多线程环境下使用该对象，发现该对象不为空，那么直接使用，但是里面的a是0。但实际上我们期望a的值是1.

- cache line：缓存行（每一行64字节）

    - 缓存的数据是一行一行的存储，内存里面的数据按照一行或一块来读进CPU。64字节是一个折中值。
    
- 内存屏障（JVM层面规范要求 ）：LoadLoad（两条读指令加屏障，保证他们不能指令重排）,StoreStore,LoadStore,StoreLoad

    - 作用：**防止指令重排、保存内存可见**

    - **对volatile修饰的内存读和写：需要在他们前后分别加上屏障**

        ![](C:\Users\i337040\git\Java_Guide\Interview\zhifubao\resource\img\basic\memory_barrier.png)

- as if serial：不管指令怎么排序，程序的执行结果一定不会发生改变，就像在单线程环境下执行。

- happens before（JVM层面规范）：**有哪些指令不可以重排序，都得加屏障**，8种原则。



## 容器

Map迭代器，一个类中多个synchronized方法调用不同方法会出现什么？

set怎么判断元素是否重复？

list,set,map的使用

HashMap中根据某个规则移除参数？HashMap的原理，存取值的原理，算法，时间复杂度？

### ConcurrentHashMap如何实现并发安全的，HashMap和ConcurrentHashMap底层实现

- HashMap

    - 底层数据结构

        - JDK1.7及其以前版本：数组+链表

        - ```java
            public V put(K key, V value) {
                if (table == EMPTY_TABLE) {
                    inflateTable(threshold);
                }
                if (key == null)
                    return putForNullKey(value);
                int hash = hash(key);
                int i = indexFor(hash, table.length);
                //得到table数组所在i位置的元素，遍历i元素所在链表所有元素
                //查看传入的key是否已经存在于链表中，如果存在，则替换key所对应的value值，不做插入操作
                for (Entry<K,V> e = table[i]; e != null; e = e.next) {
                    Object k;
                    if (e.hash == hash && ((k = e.key) == key || key.equals(k))) {
                        V oldValue = e.value;
                        e.value = value;
                        e.recordAccess(this);
                        return oldValue;
                    }
                }
            
                modCount++;
                addEntry(hash, key, value, i);
                return null;
            }
            
            void addEntry(int hash, K key, V value, int bucketIndex) {
                    if ((size >= threshold) && (null != table[bucketIndex])) {
                        resize(2 * table.length);
                        hash = (null != key) ? hash(key) : 0;
                        bucketIndex = indexFor(hash, table.length);
                    }
            
                    createEntry(hash, key, value, bucketIndex);
                }
            
            //第bucketIndex元素和新创建的元素调换一下位置，也就是头插法插入元素
            void createEntry(int hash, K key, V value, int bucketIndex) {
                    Entry<K,V> e = table[bucketIndex];
                	//头插法插入元素
                    table[bucketIndex] = new Entry<>(hash, key, value, e);
                    size++;
                }
            
            void resize(int newCapacity) {
                    Entry[] oldTable = table;
                    int oldCapacity = oldTable.length;
                    if (oldCapacity == MAXIMUM_CAPACITY) {
                        threshold = Integer.MAX_VALUE;
                        return;
                    }
            
                    Entry[] newTable = new Entry[newCapacity];
                    transfer(newTable, initHashSeedAsNeeded(newCapacity));
                    table = newTable;
                    threshold = (int)Math.min(newCapacity * loadFactor, MAXIMUM_CAPACITY + 1);
                }
            
            /**
                 * Transfers all entries from current table to newTable.
                 */
                void transfer(Entry[] newTable, boolean rehash) {
                    int newCapacity = newTable.length;
                    for (Entry<K,V> e : table) {
                        while(null != e) {
                            //多线程竞争插入元素的情况下，可能会造成链表成环
                            Entry<K,V> next = e.next;
                            if (rehash) {
                                e.hash = null == e.key ? 0 : hash(e.key);
                            }
                            int i = indexFor(e.hash, newCapacity);
                            e.next = newTable[i];
                            newTable[i] = e;
                            e = next;
                        }
                    }
                }
            ```

            

        - JDK1.8及以后：数组+链表+红黑树。目的是为了提高遍历元素的效率。

    - 添加元素流程：往HashMap中添加键值对，通过key计算出hashCode，通过hashCode定位到元素所在hash表中的具体位置，如果该位置已经有元素存在，那么再去判断key值是否equals，如果key也相同，那么用新的元素的value替换掉原来的元素。

    - 线程安全：不是安全，如果要保证线程安全，请使用ConcurrentHashMap.

    - 扩容：在初始化HashMap的时候，如果没有指定其容量大小，那么默认是**16**。如果添加元素的个数超过其**阈值(默认是3/4)**，那么会进行扩容，**新的容量是原来容量的2倍**。因此，如果需要大量添加数据，我们最好指定其容量大小，这样的话可以避免频繁扩容所带来的频繁开销。

- JDK1.7存在的问题以及如何解决的

    - HashMap添加元素的个数达到了其容量的3/4，就会进行扩容。**在扩容的过程中并且是在多线程并发插入数据的情况下，可能会出现链表成环的情况，因此下一次去get数据的时候就会出现死循环**。
    - 解决：**JDK1.8及其以后采用了尾插法解决了链表成环的问题，但是由于插入元素的操作不具备原子性，因此会存在数据丢失的风险。**

- ConcurrentHashMap

    - JDK1.7

        - 底层数据结构：Segment数组+HashEntry
        - 高并发如何保证：分段锁的设计思想。插入元素的过程中，会通过其key定位到某个Segment，也就是只会锁在当前Segment，其他线程插入数据到其他的Segment，插入操作并不会被阻塞。从而提高了并发访问的效率。

        ![](C:\Users\i337040\git\Java_Guide\Interview\zhifubao\resource\img\container\jdk1.7_Segment.png)

        ```java
        public V put(K key, V value) {
            	//采用分段锁来控制并发
                Segment<K,V> s;
                if (value == null)
                    throw new NullPointerException();
                int hash = hash(key);
                int j = (hash >>> segmentShift) & segmentMask;
                if ((s = (Segment<K,V>)UNSAFE.getObject          // nonvolatile; recheck
                     (segments, (j << SSHIFT) + SBASE)) == null) //  in ensureSegment
                    s = ensureSegment(j);
                return s.put(key, hash, value, false);
            }
            
            final V put(K key, int hash, V value, boolean onlyIfAbsent) {
                    HashEntry<K,V> node = tryLock() ? null :
                        scanAndLockForPut(key, hash, value);
                    V oldValue;
                    try {
                        HashEntry<K,V>[] tab = table;
                        int index = (tab.length - 1) & hash;
                        HashEntry<K,V> first = entryAt(tab, index);
                        for (HashEntry<K,V> e = first;;) {
                            if (e != null) {
                                K k;
                                if ((k = e.key) == key ||
                                    (e.hash == hash && key.equals(k))) {
                                    oldValue = e.value;
                                    if (!onlyIfAbsent) {
                                        e.value = value;
                                        ++modCount;
                                    }
                                    break;
                                }
                                e = e.next;
                            }
                            else {
                                if (node != null)
                                    node.setNext(first);
                                else
                                    node = new HashEntry<K,V>(hash, key, value, first);
                                int c = count + 1;
                                if (c > threshold && tab.length < MAXIMUM_CAPACITY)
                                    rehash(node);
                                else
                                    setEntryAt(tab, index, node);
                                ++modCount;
                                count = c;
                                oldValue = null;
                                break;
                            }
                        }
                    } finally {
                        unlock();
                    }
                    return oldValue;
                }
        
        public V get(Object key) {
                Segment<K,V> s; // manually integrate access methods to reduce overhead
                HashEntry<K,V>[] tab;
                int h = hash(key);
                long u = (((h >>> segmentShift) & segmentMask) << SSHIFT) + SBASE;
                if ((s = (Segment<K,V>)UNSAFE.getObjectVolatile(segments, u)) != null &&
                    (tab = s.table) != null) {
                    for (HashEntry<K,V> e = (HashEntry<K,V>) UNSAFE.getObjectVolatile
                             (tab, ((long)(((tab.length - 1) & h)) << TSHIFT) + TBASE);
                         e != null; e = e.next) {
                        K k;
                        if ((k = e.key) == key || (e.hash == h && key.equals(k)))
                            return e.value;
                    }
                }
                return null;
            }
        ```

        - 并发度：默认是16

        - put操作流程：

            - 尝试获取锁，如果没有获取到锁那么就自旋获取锁，如果说达到指定次数之后（多核处理器是自旋64次，如果单核的话就自旋1次），还没有获取到锁当前线程就会阻塞。获取到锁就会执行插入元素操作。

        - get操作：

            - 通过key定位到具体的Segment，再通过一次hash就可以地位到具体元素。**get操作效率很高，因为它不需要加锁**

            

    - JDK1.8

        - 摒弃了分段锁的设计思想，采用了CAS和Synchronized来控制并发。
        - 底层数据结构：数组+链表+红黑树
        - **为什么要摒弃分段锁**
            - 分段会内存不连续，内存碎片化，浪费了内存空间
            - 锁粒度更小，JDK1.7要锁住某个Segment，而JDK1.8只需要锁住单个结点，提高了并发访问效率。
        - **为什么用Synchronized而不采用JDK1.7里面的ReentrantLock**
            - ​	JDK1.6以后对Synchronized进行了优化，引入了偏向锁，轻量级锁，自旋锁，锁粗化，锁消除等等优化技术对JVM锁进行了优化，大大提高了Synchronized锁的效率。

## 并发

1.创建线程池的几种方法，多线程开发经验和线程池的使用，多线程的使用(结合自己项目中来讲)，线程池核心参数，为什么核心线程数是cpu的倍数，线程池的关键字有哪些，之间的关系是什么？

2.BIO和NIO区别

### 锁的转换过程，自旋锁是什么，乐观锁，悲观锁是什么以及应用场景

### JVM

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