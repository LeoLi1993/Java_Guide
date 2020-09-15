##并发编程

[toc]

### 进程与线程

1.进程

- 资源分配的最小单位

2.线程

- CPU调度的最小单位

总括：比如我们打开一个qq.exe,这里qq就是一个进程。而qq里面发送语音或者消息，这个时候就是通过该进程里面开启的线程来实现的。一个进程里面有一个或者多个线程。

3.Java里面默认有两个线程：主线程和GC线程。

4.Java可以开启线程吗

- 不可以，它是调用C++来开启线程的。

```java
public synchronized void start() {
        /**
         * This method is not invoked for the main method thread or "system"
         * group threads created/set up by the VM. Any new functionality added
         * to this method in the future may have to also be added to the VM.
         *
         * A zero status value corresponds to state "NEW".
         */
        if (threadStatus != 0)
            throw new IllegalThreadStateException();

        /* Notify the group that this thread is about to be started
         * so that it can be added to the group's list of threads
         * and the group's unstarted count can be decremented. */
        group.add(this);

        boolean started = false;
        try {
            start0();
            started = true;
        } finally {
            try {
                if (!started) {
                    group.threadStartFailed(this);
                }
            } catch (Throwable ignore) {
                /* do nothing. If start0 threw a Throwable then
                  it will be passed up the call stack */
            }
        }
    }
	
    private native void start0();
```

5.并发和并行

- 并发：多线程操作同一资源。

- 并行：多核CPU，多线程同时执行。

- 并发编程的本质：充分利用CPU的资源。

    ```java
    public class Test
    {
        public static void main(String[] args)
        {
            //CPU 密集型； IO密集型
            System.out.println(Runtime.getRuntime().availableProcessors());
        }
    }
    ```

    

6.线程状态

```
public enum State {
       
       //新生，线程还没有启动
        NEW,

        //运行
        RUNNABLE,

        //阻塞，等待锁
        BLOCKED,

        //等待，死死的等，等待其他线程调用notify,notifyAll把它唤醒
        WAITING,

		//超市等待，时间过了就不等了
        TIMED_WAITING,

		//终止
        TERMINATED;
    }
```

7.wait/sleep区别

- 来自不同的类
    - wait()：来自Object
    - sleep：来自Thread

- 锁的释放
    - wait()：释放当前持有的锁
    - sleep()：不释放锁
- 使用范围：
    - wait()：需要在同步代码块中使用
    - sleep()：在代码中任何地方使用
- wait与notify和notifyAll搭配使用
    - notify()：在队列中唤醒任意一个在此对象监视器上等待线程
    - notifyAll()：唤醒所有在此对象监视器上等待的线程。

### Synchronized与Lock

1.Synchronized

- 多线程环境下控制资源同步访问，同步代码块是一个原子操作
- 版本：
    - JDK1.6及其以前：synchronized是一把重量级锁，某个线程获取到锁之后，其他线程就处于阻塞状态，直到当前线程释放掉锁以后，处于阻塞队列中的线程会去竞争这把锁。竞争到锁的线程会发生线程切换，这个时候会调用操作系统函数使得**操作系统由用户态转成和心态**，这个操作是十分耗时的，因此JDK1.6以前synchronized效率是比较低下的。
    - JDK1.6以后：对synchronized进行了优化，引入了偏向锁，轻量级锁，自旋锁等等。
        - 偏向锁：没有多线程竞争情况下，会把整个同步代码块给消除掉。它偏向于第一次获取到锁的那个线程，在接下来的执行过程中，该线程获取到锁的概率更大。那么如果偏向锁获取失败，那么会膨胀为轻量级锁。
        - 轻量级锁：轻量级锁采用CAS加锁，相比与重量级锁直接使用操作系统的互斥量所产生的性能开销更小。如果多线程环境下锁资源竞争激烈，如果轻量级锁加锁失败之后，轻量级锁会膨胀为重量级锁。
        - 自旋锁：在轻量级锁加锁失败之后，它会尝试空转，也就是什么都不做，等其他线程释放锁。因为线程获取到锁之后执行的时间很快，远低于线程阻塞到执行这两种线程状态的切换时间。还是获取不到锁的话，那么就会膨胀为重量级锁。
        - 锁消除：编译器在编译Java代码的时候，会检测共享资源是否存在竞争锁的情况，如果没有，那么会消除相应的锁。
- 作用域
    - 静态方法：也就是给当前类加锁，多线程环境竞争资源的情况下，进入同步代码块之前需要获得类对象的锁。
    - 非静态方法：给当前实例对象加锁，多线程环境竞争资源的情况下，，进入同步代码块之前需要获得实例对象的锁。
- 如何确定锁定对象是谁，即锁的对象是谁？
    - 如果显示指定了锁的对象：synchronized(this), synchronized(变量名)那么就表明你加锁的对象是括号里面的对象。
    - 如果是隐式的：比如说修饰非静态方法或者静态方法
        - 非静态方法：锁的是实例对象。
        - 静态方法：那么你锁的对象是类对象。
- 字节码层面理解synchronized
- synchronized的实现是使用**monitorenter和monitorexit**来实现的，monitorenter表明同步代码块开始的位置，monitorexit表明同步代码块结束的位置.当锁的计算器为0的时候表明可以获取锁，获取到锁之后那么锁的计数器会+1，由于synchronized是可重入锁，因此可以它可以获取到同一对象的多把锁，没获取到一次锁，那么锁的计数器就+1,最后它会调用monitorexit去释放锁，没释放一次锁，锁的计数器就-1. 当锁的计数器为0的时候表明锁已经全部释放完。

2.Lock

- 位置：它是在JUC包下的一个接口。常见的实现类有Reentrantlock，ReentrantReadWriteLock.WriteLock, ReentrantReadWriteLock.ReadLock

- 比如说它的实现类ReentrantLock

    - 构造函数通过传入的true或者false可以构造公平锁还是非公平锁。

    - synchronized不可以中断，而ReentrantLock可以被中断。

    - ReentranLock也可以实现可选择性通知

        

### 生产者消费者模型，防止虚拟唤醒

1.场景：有一个生产者一个消费者，一个盘子，盘子上只能够放一个苹果。如果说盘子上没有苹果，那么生产者会在盘子上放苹果，如果有苹果，生产者就不放，让消费者去消费苹果，请用代码实现。

- 首先这涉及到线程通信的问题

```java
package com.example.springbootredis.com.leo;

/**
 * ProjectName:${project_name}
 * FileName:${file_name}
 * Description:${todo}
 * Copyright:Copyright(c)2017
 * Company:SAP
 *
 * @authorSAP
 * @date${date}${time}
 * @see
 * @since
 */
public class ProducerConsumerTest
{
    public static void main(String[] args)
    {
        Plate plate = new Plate();
        new Thread(() -> { for (int i = 0; i < 20; i++) plate.increment(); }, "A").start(); 
        new Thread(() -> { for (int i = 0; i < 20; i++) plate.decrement(); }, "B").start();
    }
}

class Plate
{
    //盘子上的苹果，假定开始盘子上没有苹果
    private int apple = 0;

    public synchronized void increment()
    {
        //有东西那么就叫其他人取，取完之后再放
        if (apple != 0)
        {
            try
            {
                this.wait();
            }
            catch (InterruptedException exception)
            {
                exception.printStackTrace();
            }
        }
        apple++;
        System.out.println(Thread.currentThread().getName() + "=>" + apple);
        this.notify();
    }

    public synchronized void decrement()
    {
        if (apple == 0)
        {
            try
            {
                this.wait();
            }
            catch (InterruptedException exception)
            {
                exception.printStackTrace();
            }
        }
        apple--;
        System.out.println(Thread.currentThread().getName() + "=>" + apple);
        this.notify();
    }
}

```

结果：

```上
B=>0
A=>1
B=>0
A=>1
B=>0
A=>1
B=>0
A=>1
B=>0
A=>1
B=>0
A=>1
B=>0
A=>1
B=>0
A=>1
B=>0
A=>1
B=>0
A=>1
B=>0
A=>1
B=>0
A=>1
B=>0
A=>1
B=>0
A=>1
B=>0
A=>1
B=>0
A=>1
B=>0
A=>1
B=>0
A=>1
B=>0
A=>1
B=>0
A=>1

Process finished with exit code 0

```

- 但这样有一个问题，也就是当生产者和消费者增多的时候，会出现消费或者生产紊乱的情况，也就是**线程假唤醒**。

复现：

```java
 public static void main(String[] args)
 {
     Plate plate = new Plate();
     new Thread(() -> { for (int i = 0; i < 50; i++) plate.increment(); }, "A").start();
     new Thread(() -> { for (int i = 0; i < 50; i++) plate.decrement(); }, "B").start();
     new Thread(() -> { for (int i = 0; i < 50; i++) plate.increment(); }, "C").start();
     new Thread(() -> { for (int i = 0; i < 50; i++) plate.decrement(); }, "D").start();
 }
```

结果：

![](C:\Users\i337040\git\Java_Guide\Java\Concurrency\Resource\img\thread_process\fake_invoke.png)

问题原因：if判断肯定有问题，我们应该用while，需要注意的是生产者生产的数量一定要和消费者消费的数量一致，不然会出现死锁。也就是说会有线程等待消费或者等待生产。

2.通过使用Lock来实现生产者和消费者模型，并且期望实现某个生产者生产了苹果让特定的消费者进行消费。

