[容器层级图](#容器层级图)

[Collection](#Collection)

- [List](#List)
    - [ArrayList](#ArrayList)
    - [LinkedList](#LinkedList)
    - [CopyOnWriteArrayList](#CopyOnWriteArrayList)
    - [Vector](#Vector)
    - [Stack](#Stack)
- [Set](#Set)
    - [HashSet](#HashSet)
    - [TreeSet](#TreeSet)
    - [CopyOnWriteHashSet](#CopyOnWriteHashSet)

- [Queue](#Queue)
    - [ArrayBlockingQueue](#ArrayBlockingQueue)
    - [LinkedBlockingQueue](#LinkedBlockingQueue)
    - [SynchronousQueue](#SynchronousQueue)

[Map](#Map)

- [HashMap](#HashMap)
- [ConcurrentHashMap](#ConcurrentHashMap)
- [TreeMap](#TreeMap)
- [Hashtable](#Hashtable)

### 容器层级图

![](./resource/img/architecture/Collection.png)![Map](./resource/img/architecture/Map.png)

### Collection

#### List

- ##### ArrayList

    - 线程安全

        - 不是线程安全的

    - 底层数据结构

        - 采用Object数组存储数据

            ```java
            transient Object[] elementData;
            
            //添加元素
            public boolean add(E e) {
                    ensureCapacityInternal(size + 1);  // Increments modCount!!
                    elementData[size++] = e;
                    return true;
                }
            ```

    - 元素是否有序

        - 有序

    - 是否支持快速随机访问

        - 是。它实现了RandomAccess接口，具备快速随机访问的能力。**遍历采用for循环效率更高**

            ```java
            public class ArrayList<E> extends AbstractList<E>
                    implements List<E>, RandomAccess, Cloneable, java.io.Serializable
            ```

    - 扩容机制

        - 我们在初始化ArrayList的时候，如果不指定容量大小，那么默认是10。我们不停的往ArrayList里面添加元素，**当元素的个数大于ArrayList容量，那么ArrayList会进行扩容,新的容量是原来的1.5倍.**

            ```java
            //扩容代码
            private void grow(int minCapacity) {
                    // overflow-conscious code
                    int oldCapacity = elementData.length;
                    int newCapacity = oldCapacity + (oldCapacity >> 1);
                    if (newCapacity - minCapacity < 0)
                        newCapacity = minCapacity;
                    if (newCapacity - MAX_ARRAY_SIZE > 0)
                        newCapacity = hugeCapacity(minCapacity);
                    // minCapacity is usually close to size, so this is a win:
                    elementData = Arrays.copyOf(elementData, newCapacity);
                }
            ```

    - 适用场景

        - 不适合：对于越靠近前面元素添加或者删除操作,ArrayList效率较低,不适合，因为要挪动大量元素，效率降低。

        - 适合：通过下标获取元素

            ```java
            public E get(int index) {
                rangeCheck(index);
            
                return elementData(index);
            }
            E elementData(int index) {
                    return (E) elementData[index];
                }
            ```

    

- ##### LinkedList

    - 线程安全

        - 不是

    - 底层数据结构

        - 双向链表

            ```java
            public class LinkedList<E>
                extends AbstractSequentialList<E>
                implements List<E>, Deque<E>, Cloneable, java.io.Serializable
            {
                transient int size = 0;
            
                /**
                 * Pointer to first node.
                 * Invariant: (first == null && last == null) ||
                 *            (first.prev == null && first.item != null)
                 */
            	//指向头部
                transient Node<E> first;
            
                /**
                 * Pointer to last node.
                 * Invariant: (first == null && last == null) ||
                 *            (last.next == null && last.item != null)
                 */
                //指向尾部
                transient Node<E> last;
            }
            ```

    - 元素是否有序

        - 是

    - 使用场景

        - 适合：频繁增删的场景

        - 不适合：不适合遍历的场景，遍历的时候先根据下标值判断数据在左边还是右边，再决定从头还是尾部进行遍历。 

            ```java
            //遍历元素
            public E get(int index) {
                checkElementIndex(index);
                return node(index).item;
            }
            
            Node<E> node(int index) {
                    // assert isElementIndex(index);
            
                    if (index < (size >> 1)) {
                        Node<E> x = first;
                        for (int i = 0; i < index; i++)
                            x = x.next; //从头遍历
                        return x;
                    } else {
                        Node<E> x = last;
                        for (int i = size - 1; i > index; i--)
                            x = x.prev; //从尾部遍历
                        return x;
                    }
                }
            ```

    - 遍历：由于没有实现RandomAccess接口，因此采用迭代器iterator循环效率更高。

- ##### CopyOnWriteArrayList

    - 线程安全

        - 是，写的时候加锁，读不加锁。

            ```java
            //添加元素
            public boolean add(E e) {
                final ReentrantLock lock = this.lock;
                lock.lock();
                try {
                    Object[] elements = getArray();
                    int len = elements.length;
                    Object[] newElements = Arrays.copyOf(elements, len + 1);
                    newElements[len] = e;
                    setArray(newElements);
                    return true;
                } finally {
                    lock.unlock();
                }
            }
            
            /**
                 * {@inheritDoc}
                 *
                 * @throws IndexOutOfBoundsException {@inheritDoc}
                 */
            	//通过index读取数据
                public E get(int index) {
                    return get(getArray(), index);
                }
            /**
                 * Gets the array.  Non-private so as to also be accessible
                 * from CopyOnWriteArraySet class.
                 */
                final Object[] getArray() {
                    return array;
                }
            
             	private E get(Object[] a, int index) {
                    return (E) a[index];
                }
            ```

            

    - 底层数据结构

        - 采用volatile Object数组存储数据

            ```java
            /** The array, accessed only via getArray/setArray. */
            private transient volatile Object[] array;
            ```

    - 引入原因

        - ArrayList不是线程安全的，但是使用Vector锁的粒度太大，同样使用Collections.synchronizedList方法，锁定粒度也太大了。因此引入了CopyOnWriteArrayList。

    - 工作原理

        - 添加元素：通过ReentrantLock加锁，采用COW设计理念，创建一个副本出来，新添加的元素先设置到副本里面，当添加完之后再把原来的引用指向副本。这样就实现了元素的添加。
            - 优点：在并发情况下，**由于读操作没有加锁，那么其他线程可以读取原来数组里面的内容。不会出现并发修改异常**。
            - 缺点：它能够保持数据最终一致性，**但是不能够保证数据的实时性一致性**。由于采用了COW设计思想，会开辟新的内存区域来存放副本内容，增加了**内存开销**。

- ##### Vector

    - 线程安全

        - 是的，所有的方法都加了synchronized关键字，锁的粒度太大。

    - 底层数据结构

        - Object[]

            ```java
            protected Object[] elementData;
            ```

    - 扩容

        - 如果不指定容量大小，默认是10。当往Vector里面添加元素超过了其容量，那么会进行扩容，如果没有指定它的一个增量，那么默认是新的容量是原来的两倍。如果指定了增量，那么新的容量= oldCapacity + capacityIncrement.

            ```java
            //在初始化Vector的时候，看你是否指定了其增量capacityIncrement
            public Vector(int initialCapacity, int capacityIncrement) {
                super();
                if (initialCapacity < 0)
                    throw new IllegalArgumentException("Illegal Capacity: "+
                                                       initialCapacity);
                this.elementData = new Object[initialCapacity];
                this.capacityIncrement = capacityIncrement;
            }
            
            //扩容
            private void grow(int minCapacity) {
                    // overflow-conscious code
                    int oldCapacity = elementData.length;
                    int newCapacity = oldCapacity + ((capacityIncrement > 0) ?
                                                     capacityIncrement : oldCapacity);
                    if (newCapacity - minCapacity < 0)
                        newCapacity = minCapacity;
                    if (newCapacity - MAX_ARRAY_SIZE > 0)
                        newCapacity = hugeCapacity(minCapacity);
                    elementData = Arrays.copyOf(elementData, newCapacity);
                }
            ```

    - 弃用原因

        - Vector JDK1.0就引入了，老容器了。由于**所有方法都需要加锁，性能太低**。
        - 相比于ArrayList，扩容的时候，如果没有为Vector指定增量，那么新的容量会是原来的2倍，而ArrayList是原来的1.5倍。也就是占用**内存空间会比ArrayList大**。

##### Stack

- 线程安全

    - 是的，添加/删除/获取元素操作全都加了Synchronized关键字，因此是线程的的

- 底层数据结构

    - Object[]数组

        ```JAVA
        //用的Vector的数组存储数据
        protected Object[] elementData;
        ```

- 常用方法

    - push(E item)：添加元素，用的父类的添加元素方法

    - pop()：弹出并移除栈顶元素

        ```java
        public synchronized E pop() {
            E       obj;
            int     len = size();
        
            obj = peek();
            removeElementAt(len - 1);
        
            return obj;
        }
        
        public synchronized void removeElementAt(int index) {
                modCount++;
                if (index >= elementCount) {
                    throw new ArrayIndexOutOfBoundsException(index + " >= " +
                                                             elementCount);
                }
                else if (index < 0) {
                    throw new ArrayIndexOutOfBoundsException(index);
                }
                int j = elementCount - index - 1;
                if (j > 0) {
                    System.arraycopy(elementData, index + 1, elementData, index, j);
                }
                elementCount--;
                elementData[elementCount] = null; /* to let gc do its work */
            }
        ```

    - peek()：获取栈顶元素

    - empty()：判断栈是否为空

- 扩容

    - 当元素个数超过其容量，那么新容量会是原来的两倍。

- 