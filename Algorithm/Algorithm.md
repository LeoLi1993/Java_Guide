# 常用算法题

[二分查找算法](#二分查找算法)

[原地算法对单链表进行重排序](#原地算法对单链表进行重排序)

## 二分查找算法

- 利用二分查找算法，查找一个有序列表，找到则返回该元素所在位置，没找到则返回-1。

    ```java
    public class Test
    {
        public static void main(String[] args)
        {
            int[] array = {1,2,4,5,7,8,10};
            System.out.println(binarySearch(array, 9));
        }
    
        public static int binarySearch(int[] array, int value)
        {
            //定死左边和右边值
            int left = 0; 
            int right = array.length;
    
            while(left < right)
            {
                int mid = (left + right)/2; //中间数一定要写在while循环里面
    
                if(value > array[mid]) // 传入值比中间值大，那么就在右边找，即left = mid + 1;
                {
                    left = mid + 1;
                }
                if(value < array[mid]) // 传入值比中间值小，那么就在左边找，即right = mid - 1;
                {
                    right = mid -1;
                }
                if(array[mid] == value) //直到找到，返回下标
                {
                    return mid;
                }
            }
            return -1; //没找到返回-1
        }
    }
    ```



## 原地算法对单链表进行重排序

**问题描述：**

将给定的单链表L： L 0→L 1→…→L n-1→L n,

重新排序为： L 0→L n →L 1→L n-1→L 2→L n-2→…

要求使用原地算法，并且不改变节点的值

例如：

对于给定的单链表{1,2,3,4}，将其重新排序为{1,4,2,3}.

Given a singly linked list L: L 0→L 1→…→L n-1→L n,

reorder it to: L 0→L n →L 1→L n-1→L 2→L n-2→…

You must do this in-place without altering the nodes' values.

For example,
Given{1,2,3,4}, reorder it to{1,4,2,3}.

 

**解题思路：考虑把原始链表拆分为两个，利用快慢指针可以找到链表的中间节点**

　　　　**再把后面部分的链表实现翻转，使用原地算法**

　　　　**再把两个链表合并为一个链表即实现上述要求**

```java
package com.sap.springcloud;


public class Test
{
    public static void main(String[] args)
    {
        ListNode head = constructListNode();
        reorderList(head);
        while(head != null)
        {
            System.out.print(head.value+ " ");
            head = head.next;
        }

    }

    public static ListNode constructListNode()
    {
        Test test = new Test();
        ListNode head = test.new ListNode(1);
        ListNode second = test.new ListNode(2);
        ListNode third = test.new ListNode(3);
        ListNode fourth = test.new ListNode(4);
        ListNode fifth = test.new ListNode(5);
        ListNode sixth = test.new ListNode(6);
        head.next = second;
        second.next = third;
        third.next = fourth;
        fourth.next = fifth;
        fifth.next = sixth;

        return head;
    }

    public static ListNode reorderList(ListNode head) //head就是1
    {
        //1.判断链表是否为空
        if(null == head || null == head.next)
        {
            return head;
        }

        //2.利用快慢指针找到链表后半部分元素
        ListNode slow = head;
        ListNode fast = head;
        while(fast.next != null && fast.next.next != null)
        {
            slow = slow.next;
            fast = fast.next.next;
        }

        ListNode after = slow.next; // 获取到后半部分链表头第一个元素
        slow.next = null; //前面部分链表断掉
        ListNode afterReversed = null; //
        //3.链表后半部分元素进行反转
        while(after != null)  //把反转后的元素转到afterReversed
        {
            ListNode temp = after.next;
            after.next = afterReversed;
            afterReversed = after;
            after = temp;

        }

        //4.利用原地算法（即空间复杂度为O(1)，不需要借助额外的数据结构）：重新链接整个链表，链表合并
        while(head != null && afterReversed != null)
        {
            ListNode ftemp =  head.next;
            ListNode atemp = afterReversed.next;

            head.next = afterReversed;
            head = ftemp;
            afterReversed.next = head;
            afterReversed = atemp;
        }

        return head;
    }

    class ListNode
    {
        Integer value;
        ListNode next;
        public ListNode(Integer value)
        {
            this.value = value;
            next = null;
        }

        public ListNode()
        {

        }
    }
}

```

## 查找给定数值以内的素数

### 暴力解法

- 思路

  - 两层遍历 + isPrime 标记

  - 从2到n遍历一次，第二次遍历从2开始，到第一次遍历的值结束，如果找到，则素数加1，没找到就轮询一次。

    ```java
    public class PrimeCount //暴力解法
    {
        public static void main(String[] args)
        {
            System.out.println(countPrime(1000));
        }
    
        public static int countPrime(int number)
        {
    
            if(0 > number)
            {
                System.out.println("Please input positive number");
                return 0;
            }
            if(number == 1 || number == 0)
            {
                return 0;
            }
    
            int primeNumber = 0;
            for (int i = 2; i < number; i++)
            {
                boolean isPrime = true; //i default is prime number;
                for(int j=2; j < i; j++)
                {
                    if(i%j == 0)
                    {
                        isPrime = false;
                        break;
                    }
                }
                if(isPrime)
                {
                    primeNumber++;
                }
            }
    
            return primeNumber;
        }
    
    }
    ```

  - 时间复杂度：

### 埃式筛选法

- 思路

  - **从2到n之间，找到合数（非素数），并把它剔除掉，统计素数的个数**

  - 怎么找合数：2 * 2；2 * 3；2*4... 数值小于n; 3 * 3; 3 * 4...数值小于n

    ```java
    public static int eratosthenes(int n)
    {
        //true 代表素数
        boolean[] isPrime = new boolean[n];
        Arrays.fill(isPrime, true);
    
        int count = 0;
        for(int i=2; i<n; i++)
        {
            if(isPrime[i])
            {
                count++;
                for(int j=i * i; j<n; j+=i)
                {
                	isPrime[j] = false;
                }
            }
        }
        return count;
    }
    ```

## 删除排序数组中的重复项（原地删除）

- 题目：一个有序数组nums, 原地删除重复出现的元素，使每个元素只出现一次，返回删除后数组的新长度。

- 思路：采用双指针算法来实现功能
  - i & j 两个指针，i 从0开始，j从1开始，如果num[i] == num[j] 那么j++
  - 如果num[i] != num[j] 那么 i++ 然后把num[i] = num[j];
  - 最后肯定j先达到数组末尾，返回i+1的值就是元素个数
  - 

```java
public class RemoveDuplicateNumber
{
    public static void main(String[] args)
    {
        System.out.println(removeDuplicateNumber(new int[]{0, 1, 2, 2, 3, 4}));
    }

    public static int removeDuplicateNumber(int[] array)
    {
        if(0 == array.length)
        {
            return 0;
        }

        int i = 0;
        for(int j=1; j<array.length; j++)
        {
            if(array[j] != array[i])
            {
                i++;
                array[i] = array[j];
            }
        }
        return i+1;
    }
}
```

## 寻找数组中心下标

- 题目：给定一个整数数组，请编写一个能够返回的数组的“中心下标”的方法，中心下标，左侧所有元素相加的和等于右侧所有元素相加的和，如果数组不存在**中心下标**，则返回-1，如果有多个中心下标则返回最靠近左边的那一个。

- 思路：利用对称性，先计算出数组总和sum，设置total从左往右累加，sum递减，直到左边部分 == 右边部分，求出中心位置

  - ![](./resource/img/array/central_index.png)

  ```java
  package algorithm.array;
  
  import java.util.Arrays;
  
  public class CentralIndex
  {
      public static void main(String[] args)
      {
          int[] input = new int[]{1,1,1,2};
          //int[] data = {1,3,4,5,8};
  
          System.out.println(getIndex(input));
      }
  
      public static int getIndex(int[] num)
      {
          int sum = 0;
          int total = 0;
          sum = Arrays.stream(num).sum();
  
          if(num.length > 2)
          {
              for(int i=0;i<num.length;i++)
              {
                  total += num[i];
                  if(total == sum)
                  {
                      return i;
                  }
                  else
                  {
                      sum -= num[i];
                  }
              }
          }
          return -1;
      }
  }
  
  ```

  

## X的平方根

- 题目：在不适用sqrt(x)函数的情况下，得到x的平方根的整数部分

  - 解法1：二分查找

  - 思路：双重指针，left = 0 & right = input

    - 时间复杂度log(n)

    ```java
    public class Sqrt
    {
        public static void main(String[] args)
        {
            System.out.println(binarySearch(2));
        }
    
        public static int binarySearch(int input)
        {
            int left = 0; 
            int right = input;
            int index = -1;
            while(left <= right)
            {
                int mid = left + (right -left)/2;
                if( mid * mid <= input)
                {
                    //因为要找小的值，因此index在这里赋值
                    index = mid;
                    left = mid + 1;
                }
                else
                {
                    right = mid - 1;
                }
            }
            return index;
        }
    }
    ```

  - 解法二：牛顿迭代

  - 思路：**input = n * n ->  (n + input/n)/2 不停递归，值最终会趋近于其平方根**

  - ```java
    public static int newtonIterate(int input, int n)
    {
        int index = (input/n + n)/2;
        if(0 == input)
        {
            return input;
        }
        if(index == n) //这里终止预期值和最终值相等
        {
            return n;
        }
        return newtonIterate(input, index);
    }
    ```

## 斐波那契数列

- 题目：求给定斐波那契数列第n位的值；1,1,2,3,5,8...

  - 解法一：暴力递归

    ```java
    ```

    

  - 解法二：去重递归

  - 解法三：双指针迭代
