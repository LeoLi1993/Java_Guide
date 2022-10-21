# 操作系统

## 硬件基础知识

- CPU通过**针脚接收高低平的电信号，从内存里面读取数据进行计算**
- 汇编语言
  - 用助记符代替机器指令
    - 机器指令：1000100111011000  汇编指令：mov ax,bx

## 计算机组成

- PC
  - 程序指令该执行哪条命令
- Register
  - 寄存器，存储cpu计算所需的数据。速度比内存更快。
- ALU
  - 算术逻辑运算单元，用来做计算的
- MMU
  - 内存管理单元
    - 逻辑地址到内存地址的转换
    - 修改CPU对内存的访问级别
    - MMU只是在读内存和写内存完成地址变换，以及更改CPU的访问级别
- CU
  - 控制单元，控制程序运行的自动化
- Cache

![](./resource/img/basic/architecture.png)

![](./resource/img/basic/architecture_2.png)

![](./resource/img/basic/super_thread.png)

![](./resource/img/basic/cache.png)

![](./resource/img/basic/multiple_cpu.png)

### CPU指令执行

- CPU指令执行是乱序的

  - **为啥DCL需要加volatile**

    - 对象在初始化过程中可能会存在指令重排，**其他线程可能会获取到半初始化的对象，然而这个对象还没有完全初始化，直接使用会有问题**。

    ![](./resource/img/basic/cpu_no_arrange.png)

    ![](./resource/img/basic/cpu_no_arrange_2.png)

    ![](./resource/img/basic/cpu_no_arrange_3.png)

- 防止CPU指令乱序执行

  - 加内存屏障

    - CPU层面
      - 硬件层面：intel -> 原语（mfence,lfence,sfence）或者锁总线

    ![](./resource/img/basic/cpu_prevent_arrange.png)

    - JVM层面
      - volatile & synchronized -> lock指令锁
      - ![](./resource/img/basic/JVM_Memory_Barrier.png)

### CPU-合并写技术

- write combining  buffer
  - 一般是4个字节
  - 由于ALU速度太快，所以在写入L1的同时，写入一个WC Buffer，写满了之后，再直接更新到L2
  - ![](./resource/img/basic/writing_combining.png)

