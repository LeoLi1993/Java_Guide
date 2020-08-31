[TOC]

## Redis

#### 传统的RDBMS和NoSQL

1. RDBMS: 结构化数据；数据和关系存在表中；支持基础的事务。
2. Nosql: Not only SQL.
   - Nosql没有行列的概念，用key-value形式来存储数据。分类：列存储数据库，键值对存储数据库，文档类型数据库，图形数据库。

#### Redis是什么以及其作用

1. Remote Directory Server：原远程字典服务。
2. 作用：
   - Key-Value存储的系统
   - 支持高速缓存
   - 数据持久化
   - 支持发布订阅系统
3. 特性
   - 支持多种数据类型
   - 持久化
   - 集群
   - 事务

#### Redis 安装

1. Redis for windows

```
https://github.com/MicrosoftArchive/redis/releases
```

2. 下载Windows版本

![](./resource/img/install/file.png)

3. 安装完成之后，启动服务器端和客户端，分别点击：redis-server.exe/redis-cli.exe

![](./resource/img/install/server_client.png)

4. 测试客户端是或连接上服务器端

![](./resource/img/install/test_connection.png)

5. 关闭Redis服务：shutdown

#### Redis基础知识

1. DB：默认有16个DB
2. Redis是单线程还是多线程，为什么它能这么快？
3. 五种数据类型
   - String
   - List
   - Set
   - Hash
   - Zset

#### Redis常用命令

```
127.0.0.1:6379> set name leo	#设置key
OK
127.0.0.1:6379> keys *			#查看所有key
1) "name"
127.0.0.1:6379> get name		#获取key的value
"leo"
127.0.0.1:6379> exists name		#是否存在key
(integer) 1
127.0.0.1:6379> exists leo
(integer) 0
127.0.0.1:6379> expire name 10	#设置key过期时间，10s
(integer) 1
127.0.0.1:6379> ttl name		#查看key即将过期时间
(integer) 7
127.0.0.1:6379> ttl name
(integer) 3
127.0.0.1:6379> ttl name
(integer) 0
127.0.0.1:6379> get name
(nil)
127.0.0.1:6379> set age 27
OK
127.0.0.1:6379> keys *
1) "age"
127.0.0.1:6379> move age 1		#移除key
(integer) 1
127.0.0.1:6379> keys *
(empty list or set)
127.0.0.1:6379> type age		#查看key的类型
string
127.0.0.1:6379> type name
string
```

#### 五大数据类型

1. String

   - 常用的命令
     - getrange key start end
     - getset key value
     - mget key1 key2
     - mset key1 value1 key2 value2
     - setex key milisecounds value
     - setnx key value
     - strlen key
     - incr key
     - incrby key increment
     - decr key
     - decrby key decrement
     - append key value

   ```
   127.0.0.1:6379> keys *
   1) "age"
   2) "name"
   127.0.0.1:6379> get name
   "leo"
   127.0.0.1:6379> getrange name 0 2 	#从start到end,位置获取Key的值,闭区间
   "leo"
   127.0.0.1:6379> getset name LEO 	#获取key的值并显示，最后用新值替换旧值
   "leo"
   127.0.0.1:6379> get name
   "LEO"
   127.0.0.1:6379> getset gender female #获取key的值并显示，最后用新值替换旧值
   (nil)
   127.0.0.1:6379> get gender
   "female"
   127.0.0.1:6379> mget name gender	#获取多个key的值
   1) "LEO"
   2) "female"
   127.0.0.1:6379> setex name 10 bbb 	设置key的值为bbb并在10s后过期
   OK
   127.0.0.1:6379> get name
   "bbb"
   127.0.0.1:6379> ttl name
   (integer) 5
   127.0.0.1:6379> ttl name
   (integer) 2
   127.0.0.1:6379> get name
   (nil)
   127.0.0.1:6379> setnx name BBB	#当key不存在的时候，才创建其值
   (integer) 1
   127.0.0.1:6379> get name
   "BBB"
   127.0.0.1:6379> setnx name bbb
   (integer) 0
   127.0.0.1:6379> get name
   "BBB"
   127.0.0.1:6379> mset key1 value1 key2 value2	#同时创建或者更新多个key-value键值对
   OK
   127.0.0.1:6379> mget key1 key2
   1) "value1"
   2) "value2"
   127.0.0.1:6379> strlen key1			#获取key的值的长度
   (integer) 6
   127.0.0.1:6379> get age
   "2"
   127.0.0.1:6379> incr age		# key对应的value值加1自增
   (integer) 3
   127.0.0.1:6379> incr age
   (integer) 4
   127.0.0.1:6379> decr age		# key对应的value值减1自减
   (integer) 3
   127.0.0.1:6379> decr age
   (integer) 2
   127.0.0.1:6379> incrby age 10	# key对应的value值按照指定步长增长
   (integer) 12
   127.0.0.1:6379> incrby age 10
   (integer) 22
   127.0.0.1:6379> decrby age 10	# key对应的value值按照指定步长减少
   (integer) 12
   127.0.0.1:6379> decrby age 10
   (integer) 2
   127.0.0.1:6379> get name
   "BBB"
   127.0.0.1:6379> append name CCC		#key对应的value值最后添加新的内容
   (integer) 6
   127.0.0.1:6379> get name
   "BBBCCC"
   ```

2. List

   - 数据结构：采用双向链表存储数据
   - 常用命令：
     - lpush list value [value1 ...]
     - lrange list start end 
     - linsert list before value value1
     - linsert list after value value1
     - lindex list index
     - lpop list
     - rpop list
     - ltrim list start end
     - lset list index value

   ```bash
   127.0.0.1:6379> lpush key 1 2 3		#从左边插入元素
   (integer) 3
   127.0.0.1:6379> keys *
   1) "key"
   127.0.0.1:6379> lrange key 0 -1		#查看列表中所以元素
   1) "3"
   2) "2"
   3) "1"
   127.0.0.1:6379> linsert key after 1 0	#往列表中的1元素的后面插入0
   (integer) 4
   127.0.0.1:6379> lrange key 0 -1
   1) "3"
   2) "2"
   3) "1"
   4) "0"
   127.0.0.1:6379> linsert key before 3 4		#往列表key中的3的前面插入4
   (integer) 5
   127.0.0.1:6379> lrange key 0 -1
   1) "4"
   2) "3"
   3) "2"
   4) "1"
   5) "0"
   127.0.0.1:6379> lindex key 4		#获取列表中第4个元素的下标
   "0"
   127.0.0.1:6379> lpop key			#弹出列表中最左边的元素
   "4"
   127.0.0.1:6379> lrange key 0 -1
   1) "3"
   2) "2"
   3) "1"
   4) "0"
   127.0.0.1:6379> lrange key 0 -1
   1) "3"
   2) "2"
   3) "1"
   127.0.0.1:6379> ltrim key 0 1		#按照范围修剪列表
   OK
   127.0.0.1:6379> lrange key 0 -1
   1) "3"
   2) "2"
   127.0.0.1:6379> lset key 0 0		#修改指定下标元素值
   OK
   127.0.0.1:6379> lrange key 0 -1		
   1) "0"
   2) "2"
   ```

3. Set

   1.  数据结构以及特性：通过哈希表实现；因此Set集合中元素不会重复出现，并且元素是无序的。查找删除元素的时间复杂度是O(1).
   2.  常用命令
      -    sadd key value1 [value2...]
      -    smembers key
      -    ​    sismember key
      -    ​    srem key value1 [value2...]
      -    ​    scard key
      -    spop key
      -    srandmember key [count] 
      -    smove source destination value
      -    sdiffstore destination key1 key2 [key3...]
      -    sinter key1 key2
      -    sunion key1 key2

   ```bash
   127.0.0.1:6379> sadd myset key1 key2 key3 #往set集合中添加元素
   (integer) 3
   127.0.0.1:6379> smembers myset			#查看set集合中所有元素
   1) "key3"
   2) "key2"
   3) "key1"
   127.0.0.1:6379> sismember myset key3	#查看某元素是否在set集合中
   (integer) 1
   127.0.0.1:6379> srem myset key3 key2	#删除set集合中某个元素
   (integer) 2
   127.0.0.1:6379> smembers myset
   1) "key1"
   127.0.0.1:6379> scard myset			#查看set集合中元素个数
   (integer) 1
   127.0.0.1:6379> srandmember myset	#随机获取set集合中的元素
   "key3"
   127.0.0.1:6379> srandmember myset 2 #随机获取set集合中2个元素
   1) "key3"
   2) "key2"
   127.0.0.1:6379> srandmember myset 2
   1) "key1"
   2) "key4"
   127.0.0.1:6379> spop myset		#弹出set集合中
   "key6"
   127.0.0.1:6379> smove myset mysetCopy key5 #把元素key5从Set集合1移动到Set集合2中
   (integer) 1
   127.0.0.1:6379> smembers mysetCopy
   1) "key5"
   127.0.0.1:6379> smembers myset
   1) "key2"
   2) "key3"
   3) "key1"
   4) "key4"
   127.0.0.1:6379> sadd myset2 key5 key6 key7
   (integer) 3
   127.0.0.1:6379> sadd myset2 key4
   (integer) 1
   127.0.0.1:6379> smembers myset2
   1) "key5"
   2) "key4"
   3) "key7"
   4) "key6"
   127.0.0.1:6379> sdiffstore myDiffSet myset myset2 #比较两个集合的差集（以第一个元素为基准），并把结果存放的myDiffSet中
   (integer) 3
   127.0.0.1:6379> smembers myDiffSet
   1) "key3"
   2) "key1"
   3) "key2"
   127.0.0.1:6379> sinter myset myset2		#计算两个集合的交集
   1) "key4"
   127.0.0.1:6379> sunion myset myset2		#计算两个集合的并集
   1) "key6"
   2) "key7"
   3) "key2"
   4) "key3"
   5) "key5"
   6) "key1"
   7) "key4"
   ```

4. Hash

   - hset myhash k1 v1

   - hmset myhash k1 v1 k2 v2
   - hget myhash k1
   - hmget myhash k1 k2
   - hgetall myhash
   - hdel myhash key1 [key2...]
   - hlen myhash 
   - hexists myhash k1
   - hkeys myhash
   - hvals myhash 
   - hincrby myhash k1 1
   - hsetnx myhahs k1 v1

   ```bash
   127.0.0.1:6379> hset myhash key1 value1			#设置myhash表的key-value
   (integer) 1
   127.0.0.1:6379> hmset myhash k1 v1 k2 v2		#批量设置myhash表的key-value
   OK
   127.0.0.1:6379> hset myhash k1 vv				
   (integer) 0
   127.0.0.1:6379> hget myhash k1					#通过key获取myhash的value		
   "vv"
   127.0.0.1:6379> hmget myhash k1 k2				#通过key批量获取myhash的value
   1) "vv"
   2) "v2"
   127.0.0.1:6379> hgetall myhash					#获取myhash表中所有的键值对
   1) "key1"
   2) "value1"
   3) "k1"
   4) "vv"
   5) "k2"
   6) "v2"
   127.0.0.1:6379> hdel myhash key1
   (integer) 1
   127.0.0.1:6379> hgetall myhash
   1) "k1"
   2) "vv"
   3) "k2"
   4) "v2"
   127.0.0.1:6379> hdel myhash k0 k1 k2		#通过key删除myhash表中所有的value
   (integer) 2
   127.0.0.1:6379> hgetall myhash
   (empty list or set)
   127.0.0.1:6379> hmset myhash k1 v1 k2 v2 k3 v3	#获取myhash表中键值对个数
   OK
   127.0.0.1:6379> hlen myhash
   (integer) 3
   127.0.0.1:6379> hexists myhash k1			#查看myhash表中k1是否存在
   (integer) 1
   127.0.0.1:6379> hexists myhash k0		
   (integer) 0
   127.0.0.1:6379> hkeys myhash				#获取myhash表中所有的key
   1) "k1"
   2) "k2"
   3) "k3"
   127.0.0.1:6379> hvals myhash				#获取myhash表中所有的value
   1) "v1"
   2) "v2"
   3) "v3"
   127.0.0.1:6379> hincrby myhash k1 1			
   (error) ERR hash value is not an integer
   127.0.0.1:6379> hgetall myhash
   1) "k1"
   2) "v1"
   3) "k2"
   4) "v2"
   5) "k3"
   6) "v3"
   127.0.0.1:6379> hset myhash k1 1			
   (integer) 0
   127.0.0.1:6379> hincrby myhash k1 1			#myhash表key对应value值增加1
   (integer) 2
   127.0.0.1:6379> hget myhash k1
   "2"
   127.0.0.1:6379> hsetnx myhash k1 1
   (integer) 0
   127.0.0.1:6379> hgetall myhash
   1) "k1"
   2) "2"
   3) "k2"
   4) "v2"
   5) "k3"
   6) "v3"
   127.0.0.1:6379> hsetnx myhash k4 v4		#往myhash表中添加元素，如果key存在则添加失败
   (integer) 1
   127.0.0.1:6379> hgetall myhash
   1) "k1"
   2) "2"
   3) "k2"
   4) "v2"
   5) "k3"
   6) "v3"
   7) "k4"
   8) "v4"
   ```

5. ZSet

   - 有序集合

     ​

6. 三种特殊类型

   - Geo地址位置

     - 底层数据结构：采用ZSet有序集合存储数据
     - 命令
       - geoadd key logtitude latitude member [key2 longtitude latitude member2]
       - geodist key member1 member2
       - geopos key member
       - georadius key longtitude latitude radius m|km|ft|mi
       - geodiusbymember key member radius m|km|ft|mi
       - geohash key memeber [member1...]

     ```bash
     127.0.0.1:6379> geoadd cities 116.23128 40.22077 beijing  121.48941 31.40527 shanghai #往地理位置集合中添加坐标
     (integer) 2
     127.0.0.1:6379> geodist cities beijing shanghai #计算两个坐标的距离
     "1088644.3544"
     127.0.0.1:6379> geoadd cities 104.10194 30.65984 chengdu  106.54041 29.40268 chongqing
     (integer) 2
     127.0.0.1:6379> geopos cities chengdu	#查看地址位置坐标：经度和纬度
     1) 1) "104.101941883564"
        2) "30.65983886217613"
     127.0.0.1:6379> georadius cities 104 30 100 km	#在地址位置集合中查找给定坐标在指定半径的坐标
     1) "chengdu"
     127.0.0.1:6379> georadius cities 104 30 1000 km
     1) "chongqing"
     2) "chengdu"
     127.0.0.1:6379> georadiusbymember cities chengdu 500 km #在地址位置集合中查找给定元素在指定半径的元素
     1) "chongqing"
     2) "chengdu"
     127.0.0.1:6379> geohash cities chengdu #经纬度经过geohash运算后得到的base32编码的字符串
     1) "wm6n2vkwx00"
     127.0.0.1:6379> zrange cities 0 -1 #Geo底层数据结构就是使用ZSet来进行存储的
     1) "chongqing"
     2) "chengdu"
     3) "shanghai"
     4) "beijing"
     ```


-    Hyperloglog

     - 作用：用来做基数统计，集合不重复元素
     - 优点：输入的数据量特别大，比如说传统的用Java程序去基数统计，需要用到for循环比较，相比于Java程序处理而言，Hyperloglog只需要占用12KB就能够处理当前任务。但这个基数统计有0.81%的误差。
     - 应用场景：页面访问量
     - 命令
       - pfadd key value1 [value2...]
       - pfcount key
       - pfmerge key key1 key2 [key3...]

     ```bash
     127.0.0.1:6379> pfadd mylog 1 2 3 4 5	#将元素添加到Hyperloglog中
     (integer) 1
     127.0.0.1:6379> pfadd mylog 56789
     (integer) 1
     127.0.0.1:6379> pfadd mylog 5 6 7 8 9
     (integer) 1
     127.0.0.1:6379> pfcount mylog		#计算Hyperloglog数量
     (integer) 10
     127.0.0.1:6379> pfadd mylog1 1 2 3
     (integer) 1
     127.0.0.1:6379> pfmerge mylog3 mylog1 mylog2
     OK
     127.0.0.1:6379> pfcount mylog3
     (integer) 3
     127.0.0.1:6379> pfmerge mylog3 mylog mylog1	#将多个Hyperloglog合并成一个新的Hyperloglog
     OK
     127.0.0.1:6379> pfcount mylog3
     (integer) 10
     ```

- BItmap

   - 用一位(bit)来表示元素的状态。
   - 应用场景：用户签到/用户是否在线
   - 命令
     - setbit key offset value #注意offset只能在0-2^32之间
     - getbit key offset
     - bitcount key

### Redis事务

- 通过四个命令来支持事务操作。

  - MULTI/DISCARD/EXEC/WATCH

- 所有任务都放在队列里面等待执行

- 不具备原子性：Redis性能非常高效，每秒10万次IO读写，因此它为了追求性能而放弃事务回滚机制，所以它不具备原子性。当然如果在编译阶段，Redis开启了事务，有一批命令，其中检测到某条命令有语法错误，那么这个时候编译就通不过，整个事务都会执行失败。

  - 编译期间出错

  - ```bash
    #编译期间出错，那么队列里面所有的命令都将放弃执行
    127.0.0.1:6379> multi
    OK
    127.0.0.1:6379> set k1 v1
    QUEUED
    127.0.0.1:6379> set k2 v2
    QUEUED
    127.0.0.1:6379> setget k3 v3
    (error) ERR unknown command 'setget'
    127.0.0.1:6379> exec
    (error) EXECABORT Transaction discarded because of previous errors.
    ```

  - 运行期间出错

    - ```bash
      127.0.0.1:6379> set k1 v1
      QUEUED
      127.0.0.1:6379> set k2 v2
      QUEUED
      127.0.0.1:6379> incr k1	#由于前面k1的值是string类型，因此该命令会执行失败
      QUEUED
      127.0.0.1:6379> set k3 v3
      QUEUED
      127.0.0.1:6379> exec
      1) OK
      2) OK
      3) (error) ERR value is not an integer or out of range
      4) OK
      127.0.0.1:6379> get k1	#前面命令会执行失败并不会影响其他命令的正确执行
      "v1"
      127.0.0.1:6379> get k3
      "v3"
      ```

- 乐观锁

  - 通过watch命令来实现乐观锁机制
  - 使用：watch key。来监视当前key是否被其他客户端或者事务修改掉，如果没有修改那么当前事务成功执行，如果被修改了，那么服务器拒绝执行当前事务并返回一个nil(空)的回复。

```bash
127.0.0.1:6379> watch k1
OK
127.0.0.1:6379> multi
OK
127.0.0.1:6379> get k1
QUEUED
127.0.0.1:6379> set k2 vv2
QUEUED
127.0.0.1:6379> set k3 vv3
QUEUED
127.0.0.1:6379> exec	#服务器拒绝执行当前事务，因为其他事务修改了k1的值
(nil)
```
### Jedis

- 常用的命令

  - 导入依赖

  - ```
    <dependency>
      <groupId>redis.clients</groupId>
      <artifactId>jedis</artifactId>
      <version>3.2.0</version>
    </dependency>
    ```

  - ```java
    Jedis jedis = new Jedis("127.0.0.1", 6379);
    jedis.flushAll();
    jedis.set("k1","v1");
    jedis.set("k2","v2");
    jedis.get("k1");
    ```

- Jedis操作事务

  - ```java
    package org.example;

    import redis.clients.jedis.Jedis;
    import redis.clients.jedis.Transaction;

    /**
     * Hello world!
     *
     */
    public class App 
    {
        public static void main( String[] args )
        {
            Jedis jedis = new Jedis("127.0.0.1", 6379);
            jedis.flushAll();
            Transaction transaction = null;
            try
            {
                transaction = jedis.multi();
                //jedis.incr("k1");
                transaction.set("k2","v2");
                transaction.set("k1","v1");
                int i = 1/0;	//编译期间异常会导致队列中所有操作都失败
              					//如果修改成transction.incr("k1");那么不影响其他指令的运行
                System.out.println(transaction.get("k1"));;
                System.out.println(transaction.get("k2"));;
                transaction.exec();
            }
            catch (Exception ex)
            {
                transaction.discard();
                System.out.println("transaction was discarded.");
                transaction.close();;
                //jedis.disconnect();;
            }

        }
    }
    ```

### SpringBoot整合

1. 源码

   ```java
   @Bean
   @ConditionalOnMissingBean(name = "redisTemplate") //当前bean不存在那么才会创建
   												//我们可以自定义RedisTemplate
   public RedisTemplate<Object, Object> redisTemplate(
     RedisConnectionFactory redisConnectionFactory)
     throws UnknownHostException {
     RedisTemplate<Object, Object> template = new RedisTemplate<Object, Object>();
     template.setConnectionFactory(redisConnectionFactory);
     return template;
   }

   @Bean
   @ConditionalOnMissingBean(StringRedisTemplate.class)
   public StringRedisTemplate stringRedisTemplate(RedisConnectionFactory redisConnectionFactory) 	//由于Redis中我们常用的类型是String类型
     						//因此单独提供了一个StringRedisTemplate
     throws UnknownHostException {
     StringRedisTemplate template = new StringRedisTemplate();
     template.setConnectionFactory(redisConnectionFactory);
     return template;
   }
   ```

   2.整合

   - 导入依赖

     ```
     <dependency>
       <groupId>org.springframework.boot</groupId>
       <artifactId>spring-boot-starter-data-jpa</artifactId>
     </dependency>
     <dependency>
       <groupId>org.springframework.boot</groupId>
       <artifactId>spring-boot-starter-data-redis</artifactId>
     </dependency>
     ```

   - 修改配置文件

   - ```
     spring.redis.host=127.0.0.1
     spring.redis.port=6379
     ```

   - 通过单测进行测试

### 持久化

1.为什么要有持久化的功能？

- 因为我们的Redis是内存数据，数据存放在内存中，会存在断电即失的情况。因此Redis需要相应的持久化的功能来保证我们的数据不会被丢失。

2.有哪些持久化机制？

- RDB和AOF

3.谈谈你对RDB持久化机制的理解？

- 总述：RDB持久化它是把数据集通过快照的形式保存到我们磁盘上。

- 触发机制：

  - 手动触发：

    - save

    - bgsave：主要命令

      | 命令    | save                             | bgsave（主）                 |
      | ----- | -------------------------------- | ------------------------- |
      |       | 同步                               | 异步                        |
      | 阻塞    | 是（在持久化过程中，其他redis client的命令会被阻塞） | 是（只发生在主进程fork子进程的过程）      |
      | 时间复杂度 | O(n)                             | O(n)                      |
      | 优点    | 不会消耗额外的内存                        | 不会阻塞其他客户端的命令              |
      | 缺点    | 阻塞客户端命令，有可能时间比较长                 | 调用fork命令，需要消耗额外内存空间去创建子进程 |

  - 自动触发：通过Redis配置文件，在指定时间内key修改了多少次就会触发bgsave持久化操作。

  优点：

  - rdb机制数据恢复速度比aof更快。
  - rdb文件内容为二进制的数据，占用内存小，更加的紧凑，适合作为备份文件。

  缺点：

  - 存在数据丢失的风险。我们知道数据持久化操作是需要在一定的时间间隔，如果这段时间间隔内Redis宕机了，那么数据会被丢失。

4.AOF

- 如何开启：配置文件中默认是不开启AOF持久化操作，如果我们想要开启该功能，需要设置appendonly yes

- 流程：比如说我们通过执行Redis命令写入一条数据，那么这条命令首先被追加到AOF缓冲区，之后通过Redis文件中配置的同步机制(no,always,everysec)来决定何时将你的命令从缓存区同步到appendonly.aof文件中。

- AOF三种同步机制：

  - no：什么时候进行同步是根据操作系统来决定的。可能存在大量命令指令丢失，是不安全的。
  - always：每次数据变更会立即同步到磁盘，性能最差，但是数据完整性最好。
  - everysec：AOF持久化操作默认的同步机制。每隔一秒做一次同步，可能存在丢失一秒数据的情况。

- 文件重写：

  - 随着时间的推移，那么AOF文件会越来越大，会存在两个问题

    - 问题1：磁盘占用空间越来越大。
    - 问题2：会造成以后Redis宕机了，Redis恢复之后，需要通过AOF文件里面的命令来还原Redis宕机之前数据库里面的数据，这个还原的过程就比较耗时。因此这个AOF文件不是越大越好，所以我们需要对文件进行重写。

  - 重写规则：Redis会创建一个新的AOF文件来替换掉旧的AOF文件，但是这两个文件的数据库中保存的数据是一致的。但是新的AOF文件会比旧的AOF文件体积小很多。

  - 重写原理：从数据库中度取出某个键的值，通过一条命令来替换掉多条命令。从而减少了AOF文件的体积。

  - 重写流程：异步操作

    - Redis进程会创建一个子进程，通过子进程对AOF文件进行重写。
    - 从创建子进程开始，父进程不仅要将命令写入AOF缓冲区，还需要将命令写入重写缓冲区。写入重写缓冲区的目的是：在子进程重写AOF文件的过程中，父进程接收的命令可能会对数据库进行修改，从而导致当前数据库的数据和重写后的AOF文件所保存的数据库里面的数据不一致。
    - 当子进程处理完毕之后，会通知父进程其处理完毕。这个时候父进程会将AOF重写缓冲区里面的数据写到新的AOF文件中，这样就保证了新的AOF文件所保存的数据和当前数据库的数据一致。
    - 新的AOF文件会替换掉就的AOF文件。

  - 同步触发机制：

    - 手动：bgrewriteaof

    - 配置文件

      ```
      auto-aof-rewrite-percentage 100
      auto-aof-rewrite-min-size 64mb
      #解释配置文件：当前AOF文件大于64MB，并且比上次重写的时候的体积大了一倍。
      #如果说之前没有重写过，那么上次重写时候的体积就是Redis启动的时候aof文件的大小。

      # This is how it works: Redis remembers the size of the AOF file after the
      # latest rewrite (if no rewrite has happened since the restart, the size of
      # the AOF at startup is used).
      ```

### RDB和AOF区别

1.实现方式

- RDB是将某个时间点的数据集以快照的形式持久化道RDB文件中
- AOF把Redis所有写命令持久化道AOF文件中

2.文件体积

- RDB记录的是结果，而AOF记录的是过程，因此AOF在后期文件会越来越大。但是针对AOF文件越来越大的问题，Redis提供了AOF文件重写机制来减小文件体积。

3.安全性

- AOF持久化的安全性比RDB更高，因为它丢失的数据更少。

4.优先级

- 如果Redis开启了AOF持久化功能，会优先使用AOF文件来还原数据。如果说没有开启AOF持久化功能，那么会使用RDB文件来还原数据。因此AOF优先级比RDB更高。

### Redis发布订阅

- 应用场景：订阅微信公账号，接收微信公众号的推送信息。实时的消息系统，比如及时聊天和群聊。
- 是一种消息通信模式。发送者通过channel发送消息给接收者，接受者者通过才channel接收消息。一个channel可以被多个接收者订阅，同样一个接受者可以订阅多个channel。订阅了同一个Channel的接收者会组成一个链表，那么发送者发送消息给channel，那么可以通过链表找到订阅了该channel的所有接收者。
- 常用命令：publish, subscribe, unsubscribe.
- 与消息队列区别：
  - 持久化：MQ支持持久化操作，数据从生产者发送给消费者之前，会持久到本地磁盘，当消费者消费完数据之后持久化到DB之后再告诉生产者把该条记录删除掉。而Redis发布订阅模型不支持持久化操作，数据可能丢失。
  - 消息保障：Redis没有Ack机制，不保证可靠传输，可能会因为网络原因导致数据丢失，MQ不会。

### Redis主从复制

1.高可用集群：我们知道单节点Redis服务，一旦服务down掉，那么整个Redis服务就不可用了。因此我们需要搭建高可用Redis服务集群，一般是一台主服务器，多台slave服务器。master复制写操作，而slave复制读的操作。

2.主从复制：

- 全量复制

  - 当master结点进行初始化的时候（或者主结点重启），从结点会把master的数据全部复制一份。

  - 流程

    - 从结点向主结点发送一个psync命令给主结点进行全量复制。

    - 主结点收到命令之后，执行bgsave在后台生产RDB文件，并且在生成RDB文件的过程中能够接收新的写命令，并把写命令追加到复制缓冲区。

    - 主结点执行完bgsave之后，将RDB文件发送给从节点。从结点收到RDB文件之后并解析其内容，把相应数据持久化。

    - 主结点会把复制缓冲区里面的写命令发送给从结点，从结点会执行这些命令从而达到了主从服务器数据一致的效果。

      ![](./resource/img/replication/whole_replication.png)


    - 全量复制缺点：
      - 主结点调用bgsave去fork一个子进程，通过子进程去生成RDB文件。这个过程非常消耗CPU，内存和磁盘空间。
      - 主结点发送RDB文件给从结点，如果文件内容比较大，那么会占用较大的网络带宽。
      - 从结点清除旧的数据，载入新的RDB文件的过程是阻塞的，也就是这个期间从结点不能做其他事情。效率比较低下。

- 增量复制

  - 由于全量复制在数据量很大情况下效率低下，在Redis2.8以后引入了增量复制，也就是主结点初始化完成之后，新写入的部分命令，这部分命令才会被同步到所有的从结点。
  - 增量复制的实现依赖于3个概念：
    - 复制偏移量（OffsetID）
      - 主从结点都会维护一个复制偏移量，当主结点向从结点同步了N字节数据之后，主结点的偏移量就变成Offset+N，从结点接收到N字节数据之后它的偏移量变成Offset+N。这样通过比较主从结点的偏移量是否一致来判定他们的数据库状态是否一致。
    - 服务器ID(RunID)：每台服务器启动的时候对应的ID，主结点会将自己的ID发送给从结点，从结点会保存主结点id，每次数据同步就是根据id来判断同步的进度。
    - 复制积压缓冲区
      - 主结点维护了一个队列作为复制积压缓冲区，默认大小为1MB。主结点在命令传播时，不仅会将写命令发送给从结点还会将命令复制到复制积压缓冲区中。

- 从结点怎么判断何时采用增量复制还是全量复制呢？

  - 从结点发送psync给主结点，里面携带了runid,offsetId，主结点根据从结点的offsetid和需要同步的数据量判定其是否超过了复制积压缓冲区，如果超过了那么进行全量复制，如果没有，那么进行增量复制。


- 命令传播
  - 数据同步阶段完成之后，主结点会进入命令传播阶段。主结点接收到的新的写命令会发送给从结点，从结点收到写命令并执行从而保证了主从数据库状态一致。

