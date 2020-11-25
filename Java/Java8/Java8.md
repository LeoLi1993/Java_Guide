##Java8新特性

### HashMap

### ConcurrentHashMap

### JVM永久代和方法区



### Lambda表达式

1.基础语法：

- Java8中引入了新的操作符"->"，箭头操作符或Lambda操作符，该操作符讲Lambda表达式拆分为两部分

    - 左侧：表达式的参数列表
    - 右侧：方法的具体实现

- 语法格式

    - 格式一：无参无返回值： () -> System.out.println("BBB");

    - 格式二：有一个参数，无返回值：(x) -> System.out.println(x);

    - 格式三：有一个参数，无返回值，小括号可以省略不写：x -> System.out.println(x);

    - 格式四：有两个以上参数，有返回值，并且Lambda体中有多条语句：

        ```java
        public Comparator<Integer> getComparator()
        {
            return (Integer data1, Integer data2) ->
            {
                System.out.println("compare two numbers...");
                return Integer.compare(data1, data2);
            };
        }
        ```

    - 格式五：有两个以上参数，有返回值，但Lambda体只有一条语句，那么可以省略return和{}：

        ```java
        public Comparator<Integer> getComparator()
        {
            return (Integer data1, Integer data2) -> Integer.compare(data1, data2);
        }
        ```

    - 格式六：Lambda参数列表中数据类型可以不用写，因为JVM编译器可以通过上下文进行推断具体的数据类型是什么样的。

        ```java
        public Comparator<Integer> getComparator()
        {
            return (data1, data2) -> Integer.compare(data1, data2);
        }
        ```

2.Lambda需要函数式接口的支持

- 函数式接口：**接口中只有一抽象方法的接口**。可以通过使用@FunctionalInterface修饰，该注解可以检查接口是否是函数式接口。

3.Java8内置的四大核心函数接口

- Consumer<T>：消费性接口
    - void accept(T t);
- Supplier<T> ：供给型接口
    - T get();
- Function<T, R>：函数型接口
    - R apply(T t);
- Predicate<T> ：断言型接口
    - boolean test(T t);

4.方法引用

- Lambda体中已经有实现了，我们可以使用方法引用

- 什么时候可以使用方法引用？

    - **当Lambda体中调用方法的参数列表和返回值类型与函数式接口中抽象方法的参数列表与返回值类型必须相同**才可以使用方法引用

        ```java
        package com.featrue;
        
        import java.util.function.Consumer;
        
        public class MethodReferenceTest
        {
            public static void main(String[] args)
            {
                Consumer<String> consumer = System.out::println; //方法引用
                //函数式接口中抽象方法参数类型是前面指定的String类型
                //抽象方法的返回值是void
                //这里PrintStream的println方法参数类型也是String，返回类型也是void
                //因此可以使用方法引用
                consumer.accept("bbb"); 
            }
        }
        ```

        

- 三种语法格式：

    - 对象::实例方法名

    - 类::静态方法名

    - 类::实例方法名

        eg: 对象::实例方法名

        ```java
        package com.featrue;
        
        import java.io.PrintStream;
        import java.util.function.Consumer;
        
        public class MethodReferenceTest
        {
            public static void main(String[] args)
            {
                PrintStream printStream = System.out;
                Consumer<String> consumer = printStream::println;
                consumer.accept("bbb");
            }
        }
        ```

    - eg: **类::实例方法名**

        - 调用规则：如果**Lambda表达式中的参数列表第一个参数**是 **实例方法的调用者，第二个参数是实例方法的参数时**，这个时候就可以通过ClassName:: methodName

            ```java
            public static void main(String[] args)
            {
                BiPredicate<String, String> biPredicate = String::equalsIgnoreCase;
                boolean result = biPredicate.test("x", "Y");
                System.out.println(result);
            }
            ```

5.构造器引用

- 语法格式：ClassName::new

- 注意：具体调用哪个构造器创建对象，那么是通过函数是接口里的方法参数来决定的

    ```java
    public static void main(String[] args)
    {
        Supplier<Employee> supplier = Employee::new;
        //由于Supplier接口里面的get方法时无参的，因此会调用无参构造器进行构造。
        Employee employee = supplier.get();
        System.out.println(employee);
        System.out.println("**************************");
        
        Function<Integer, Employee> function = Employee::new;
        //调用一个参数构造器
        Employee employee1 = function.apply(27); 
        System.out.println(employee1);
    	System.out.println("**************************");
        
        BiFunction<Integer, String, Employee> biFunction = Employee::new;
        //调用两个参数构造器
        Employee employee2 = biFunction.apply(27, "Leo"); 
        System.out.println(employee2);
    }
    
    
    package com.featrue;
    
    public class Employee
    {
        private int age;
        private String name;
        private double salary;
        private Status status;
    
        public enum Status
        {
            FREE,
            BUSY,
            VOCATION
        }
    
        public Employee(int age, String name, double salary, Status status)
        {
            this.age = age;
            this.name = name;
            this.salary = salary;
            this.status = status;
        }
    
        public Employee(int age)
        {
            this.age = age;
        }
    
        public Employee(int age, String name)
        {
            this.age = age;
            this.name = name;
        }
    
        public Employee()
        {
    
        }
    
        public int getAge()
        {
            return age;
        }
    
        public void setAge(int age)
        {
            this.age = age;
        }
    
        public String getName()
        {
            return name;
        }
    
        public void setName(String name)
        {
            this.name = name;
        }
    
        public double getSalary()
        {
            return salary;
        }
    
        public void setSalary(double salary)
        {
            this.salary = salary;
        }
    
        public Status getStatus()
        {
            return status;
        }
    
        public void setStatus(Status status)
        {
            this.status = status;
        }
    
        @Override
        public String toString()
        {
            return "Employee{" + "age=" + age + ", name='" + name + '\'' + ", salary=" + salary + ", status=" + status + '}';
        }
    }
    ```

6.数组引用

- 语法格式：Type[]::new

- 实例

    ```java
    public static void main(String[] args)
    {
        Function<Integer, String[]> function = (length) -> new String[length];
        String[] strings = function.apply(10);
        System.out.println(strings.length);
    
        Function<Integer, String[]> function2 = String[]::new;
        String[] strings2 = function2.apply(20);
        System.out.println(strings2.length);
    }
    ```

###Stream流式计算/流式API

1.Stream操作三大步骤

- 创建Stream：通过数据源(eg:集合、数组等)获取获取一个流
- 中间操作：对数据源的数据处理
- 终止操作：执行中间操作并产生结果

2.创建Stream4中方式

- 通过集合提供的stream()或者parallelStream()

    - ```java
        List<Employee> employees = new ArrayList<>();
        Stream<Employee> stream =  employees.stream();
        ```

- 通过Arrays.stream(Object[] objects)获取数组流

    - ```java
        Stream stream2 = Arrays.stream(employees.toArray());
        ```

- Stream.of(T...)

    - ```java
        Stream stream3 = Stream.of(new Employee(27,"Leo", 13000.00),new Employee(25,"Maggie", 15000.00));
        ```

- 创建无限流：Stream.iterate(final T seed, final UnaryOperator<T> f)/Stream.generate()

    - ```java
        Stream stream4 = Stream.iterate(0, (x) -> x+2);
        stream4.limit(10)
            .forEach(System.out::println);
        
        Stream stream5 = Stream.generate(() -> 2);
                stream5.limit(20)
                    .forEach(System.out::println);
        ```

3.中间操作

- 中间操作不会执行任何内容，只有当执行终止操作（foreach）才会一次性执行全部内容，即"惰性求值"。

4.Stream筛选与切片操作

- filter：接收Lambda表达式，从流中排除某些元素

- limit(n)：截断流，获取前n个元素

- skip(n)：跳过前n个元素

- distinct：筛选，通过流生成元素的hashCode和equals方法进行去重

    ```java
    List<Employee> employees = Arrays.asList(
        new Employee(27,"Leo", 13000.00),
        new Employee(25,"Maggie", 15000.00),
        new Employee(21,"Jessie", 10000.00),
        new Employee(30,"Wade", 18000.00),
        new Employee(18,"Mary", 9000.00)
    );
    public static void main(String[] args)
    {
        StreamTest streamTest = new StreamTest();
        Stream<Employee> stream = streamTest.employees.stream();
        stream.filter((employee) -> Double.compare(employee.getSalary(), 10000.00) > 0)
                .skip(2)
                .forEach(System.out::println);
    }
    ```

5.Stream映射

- map：用来或者指定元素或者对指定元素进行特殊处理

- flatMap：把流摊平

    ```java
    public void mapTest(StreamTest streamTest)
    {
        Stream<Employee> stream = streamTest.employees.stream();
        //专门获取salary
        /*stream.map(Employee::getSalary)
            .forEach(System.out::println);*/
    	//单独对name进行处理
        stream.map((employee) -> employee.getName().toLowerCase())
            .forEach(System.out::println);
    }
    ```

    ```java
    public Stream<List<Character>> buildStream(List<String> inputs)
    {
        List<Character> characters = new ArrayList<>();
        for(String input: inputs )
        {
            for (int i = 0; i < input.length(); i++)
            {
                characters.add(input.charAt(i));
            }
        }
        return Stream.of(characters);
    }
    
    public static void main(String[] args)
        {
            StreamTest streamTest = new StreamTest();
            streamTest.buildStream(streamTest.lists)
                .flatMap( data -> data.stream()) //把流摊平
                .forEach(System.out::println);
            /*Stream.of(Arrays.asList(1,2), Arrays.asList(3,4))
                .flatMap(List::stream) //把流摊平
                .forEach(System.out::println);*/
        }
    ```



6.Stream排序

- sorted()：默认是字典排序(Comparable)

- sorted()：自定义排序(实现Comparator接口)

    ```java
    public void sortEmployee(StreamTest streamTest)
    {
        Stream<Employee> stream = streamTest.employees.stream();
        stream.sorted((o1, o2) ->
        {
            //工资一样再按照年龄排序
            if (Double.compare(o1.getSalary(), o2.getSalary()) == 0) 
            {
                return o1.getAge() - o2.getAge();
            }
            else
            {
                return Double.compare(o1.getSalary(), o2.getSalary());
            }
        }).forEach(System.out::println);
    }
    ```

7.终止操作

- 查找与匹配

    - allMatch：是否匹配所有元素
    - anyMatch：是否匹配至少一个元素
    - noneMatch：一个都没有
    - findFirst：返回第一个元素
    - findAny：返回任意一个
    - count：返回元素总数
    - max：返回元素中最大值
    - min：返回元素中最小值

    ```java
    public void searchAndMatchTest(StreamTest streamTest)
        {
            boolean allMatchResult = streamTest.employees.stream().allMatch((employee) -> employee.getStatus().equals(Employee.Status.FREE));
            System.out.println(allMatchResult);
    
            boolean anyMatchResult = streamTest.employees.stream().anyMatch((employee) -> employee.getStatus().equals(Employee.Status.FREE));
            System.out.println(anyMatchResult);
    
            boolean noneMatchResult = streamTest.employees.stream().noneMatch((employee) -> employee.getStatus().equals(Employee.Status.FREE));
            System.out.println(noneMatchResult);
    
            Optional<Employee> optional = streamTest.employees.stream()
                .filter((employee) -> employee.getStatus().equals(Employee.Status.BUSY))
                .findAny();
            System.out.println(optional.get());
    
            long count = streamTest.employees.stream()
                .filter((employee) -> employee.getStatus().equals(Employee.Status.BUSY))
                .count();
            System.out.println(count);
    
            Optional<Employee> opMax = streamTest.employees.stream()
                .filter((employee) -> employee.getStatus().equals(Employee.Status.BUSY))
                .max((o1, o2) -> Double.compare(o1.getSalary(), o2.getSalary()));
            System.out.println(opMax.get());
    
            Optional<Employee> opMin = streamTest.employees.stream()
                .filter((employee) -> employee.getStatus().equals(Employee.Status.BUSY))
                .min((o1, o2) -> Double.compare(o1.getSalary(), o2.getSalary()));
            System.out.println(opMin.get());
        }
    ```

- reduce(规约)

    - T reduce(T identity, BinaryOperator<T> accumulator); 可以将流中所有元素反复结合起来最终得到一个元素T并返回

    - Optional<T> reduce(BinaryOperator<T> accumulator); 将流中元素反复结合起来并最终返回一个Optional<T>

        ```java
        public void reduceTest(StreamTest streamTest)
        {
            Optional<Double> sumResult =streamTest.employees.stream()
                .filter((employee) -> employee.getStatus().equals(Employee.Status.BUSY))
                .map(Employee::getSalary)
                .reduce((o1,o2) -> o1 + o2);
            System.out.println(sumResult.get());
        
            List<Integer> lists = Arrays.asList(1,2,3,4);
            Integer sum = lists.stream()
                .reduce(0, (Integer o1, Integer o2) -> o1+o2);
            System.out.println(sum);
            //0作为初始值赋值给o1,之后o1+o2的值赋值给o1，不停累加，最终返回o1的值。
        }
        ```

- 收集：用于将元素进行汇总

    ```java
    public void collectTest(StreamTest streamTest)
    {
        List<Double> salaries =  streamTest.employees.stream()
            .map(Employee::getSalary)
            .collect(Collectors.toList());
        System.out.println(salaries);
    
        HashSet<Double> hashSet =  streamTest.employees.stream()
            .map(Employee::getSalary)
            .collect(Collectors.toCollection(HashSet::new));
        System.out.println(hashSet);
    }
    ```

- 分组

    - 按某一字段进行分组

- 多级分组

    - 按照多个字段进行分组

        ```java
        public void groupTest(StreamTest streamTest)
        {
            Map<Employee.Status, List<Employee>> map = streamTest.employees.stream()
                .collect(Collectors.groupingBy((Employee employee) -> employee.getStatus()));
            System.out.println(map);
        
            Map<Boolean, Map<Boolean,List<Employee>>> partitionMapCopy = streamTest.employees.stream()
                    .collect(Collectors.partitioningBy((Employee employee)-> employee.getStatus().equals(Employee.Status.BUSY),
                        Collectors.partitioningBy((Employee employee) -> employee.getAge()>20
                        )));
        }
        ```

- 分区

    ```java
    public void groupTest(StreamTest streamTest)
    {
        Map<Boolean, List<Employee>> partitionMap = streamTest.employees.stream()
            .collect(Collectors.partitioningBy((Employee employee)-> employee.getStatus().equals(Employee.Status.BUSY)));
        System.out.println(partitionMap);
    
        Map<Boolean, Map<Boolean,List<Employee>>> partitionMapCopy = streamTest.employees.stream()
            .collect(Collectors.partitioningBy((Employee employee)-> employee.getStatus().equals(Employee.Status.BUSY),
                Collectors.partitioningBy((Employee employee) -> employee.getName().equals("Leo")
                )));
        System.out.println(partitionMapCopy);
    }
    ```

8.并行流与串行流



### 便于并行



### 最大化减小空指针异常 Optional



