# XSLT

## [文档](https://www.tutorialspoint.com/xslt/xslt_template.htm)

## XSLT 使用 XPath

- XSLT 使用 XPath 在 XML 文档中查找信息

### 它如何工作

- 在转换过程中，XSLT **使用 XPath 来定义源文档中可匹配一个或多个预定义模板的部分**。一旦匹配被找到，XSLT 就会把源文档的匹配部分转换为结果文档。

## xsl element reference

### <xsl:template>

- XSL 样式表由**一个或多套被称为模板**（template）的规则组成。

- 每个模板含有当某个指定的节点被匹配时所应用的规则。

- 通过pattern来匹配哪个节点

  - ```xml
    <xsl:template match = "/"> <!-- 匹配xml根节点-->
        
    ```
    
  - ```xml
    <xsl:template 
       name = Qname (Qualified Name)
       match = Pattern 
       priority = number 
       mode = QName >
    </xsl:template>
    ```

### <xsl:apply-tempate>

- ```
  The <xsl:apply-templates> element selects a set of nodes in the input tree and instructs the processor to apply the proper templates to them.
  ```

- ```xml
  <xsl:apply-templates select=EXPRESSION mode=NAME>
    <xsl:with-param> [optional]
    <xsl:sort> [optional]
  </xsl:apply-templates>
  ```

### <xsl:element>

- Creates an output element with the specified name.

- ```xml
  <xsl:element
    name = "element-name"  
    namespace = "uri-reference"
    use-attribute-sets = QName
  </xsl:element>
  ```

- ```xml
  <xsl:template match="/class/student">
      <xsl:copy-of select="firstname">
      </xsl:copy-of>
      <xsl:element name="xsl:template">
          <xsl:attribute name="match">cost</xsl:attribute>
          <xsl:attribute name="xml:space">preserve</xsl:attribute>
      </xsl:element>
  </xsl:template>
  ```

  

### <xsl:attribute>

- ```
  The <xsl:attribute> element creates an attribute in the output document, using any values that can be accessed from the stylesheet
  ```

- ```xml
  <xsl:attribute name=NAME namespace=URI>
    TEMPLATE
  </xsl:attribute>
  ```

- 向element添加属性(attribute)

  - ```xml
    <Leo_Test>
    	<xsl:attribute name="TestAttribute" select="/class/student/@rollno"/>
    </Leo_Test>
    ```

### <xsl:attribute-set>

- ```
  The <xsl:attribute-set> element creates a named set of attributes, which can then be applied as whole to the output document, in a manner similar to named styles in CSS.
  ```

- ```xml
  <xsl:attribute-set name=NAME use-attribute-sets=LIST-OF-NAMES>
    <xsl:attribute>
  </xsl:attribute-set>
  ```

- 创建一组attribute集合，包含多个attribute信息

### <xsl:value-of>

- 提取某个 XML 元素的值，并把值添加到转换的输出流中
  
- <xsl:for-each select="xxx">
  
  - 对xxx节点进行循环
    
  - ```xml
    <xsl:for-each select=EXPRESSION>
      <xsl:sort> [optional]
      TEMPLATE
    </xsl:for-each>
    ```

### <xsl:for-each>

- **过滤：**遍历xxx节点，并且把name是test的xxx节点过滤掉
- 过滤运算符
  - =
  - !=
  -  &lt；
  - &gt；

### <xsl:sort>

- 对结果集进行排序

- ```
  The <xsl:sort> element defines a sort key for nodes selected by <xsl:apply-templates> or <xsl:for-each> and determines the order in which they are processed.
  ```

- ```
  <xsl:sort
    select=EXPRESSION
    order="ascending" | "descending"
    case-order="upper-first" | "lower-first"
    lang=XML:LANG-CODE
    data-type="text" | "number" />
  ```

- ```xml
  <xsl:template match="/class/student">
          <xsl:for-each select="/class/student">
              <xsl:sort select="firstname" order="descending"></xsl:sort>
              - <xsl:value-of select="firstname"/>
          </xsl:for-each>
      </xsl:template>
  ```

### <xsl:if>

- ```
  <xsl:if 
    test = boolean-expression > 
  </xsl:if> 
  ```

- ```xml
  <xsl:template match="/class/student">
          <xsl:for-each select="/class/student">
              <xsl:sort select="firstname" order="descending"></xsl:sort>
                  <xsl:if test="marks > 90">
                  - <xsl:value-of select="firstname"/>
                  </xsl:if>
          </xsl:for-each>
  </xsl:template>
  ```

- 分数大于90才选择firstname值

### <xsl:choose>和<xsl:when> 和<xsl:otherwise>

- 用来表示多重条件测试

- <xsl:apply-template>
  
  - <xsl:apply-templates> 元素可把一个模板应用于当前的元素或者当前元素的子节点。
    
    - 假如我们向 <xsl:apply-templates> 元素添加一个 select 属性，此元素就会仅仅处理与属性值匹配的子元素。我们可以使用 select 属性来规定子节点被处理的顺序。
    - 针对某个节点单独处理
    
  - ```
    <xsl:apply-template 
       select = Expression 
       mode = QName > 
    </xsl:apply-template> 
    ```
  
  - ```xml
    <?xml version = "1.0" encoding = "UTF-8"?> 
    <xsl:stylesheet version = "1.0" 
       xmlns:xsl = "http://www.w3.org/1999/XSL/Transform">   
       <xsl:template match = "/"> 
          <html> 
             <body> 
                <h2>Students</h2> 
                <xsl:apply-templates select = "class/student" /> 
             </body> 
          </html> 
       </xsl:template>  
    
       <xsl:template match = "class/student"> 
          <xsl:apply-templates select = "@rollno" /> 
          <xsl:apply-templates select = "firstname" /> 
          <xsl:apply-templates select = "lastname" /> 
          <xsl:apply-templates select = "nickname" /> 
          <xsl:apply-templates select = "marks" /> 
          <br /> 
       </xsl:template>  
    
       <xsl:template match = "@rollno"> 
          <span style = "font-size = 22px;"> 
             <xsl:value-of select = "." /> 
          </span> 
          <br /> 
       </xsl:template>  
    
       <xsl:template match = "firstname"> 
          First Name:<span style = "color:blue;"> 
             <xsl:value-of select = "." /> 
          </span> 
          <br /> 
       </xsl:template>  
    
       <xsl:template match = "lastname"> 
          Last Name:<span style = "color:green;"> 
             <xsl:value-of select = "." /> 
          </span> 
          <br /> 
       </xsl:template>  
    
       <xsl:template match = "nickname"> 
          Nick Name:<span style = "color:red;"> 
             <xsl:value-of select = "." /> 
          </span> 
          <br /> 
       </xsl:template>  
    
       <xsl:template match = "marks"> 
          Marks:<span style = "color:gray;"> 
             <xsl:value-of select = "." /> 
          </span> 
          <br /> 
       </xsl:template>  
    	
    </xsl:stylesheet>
    ```
  
  - 案例：年龄大于30的才挑选出name&age，并按照age排序

```xml
<?xml version="1.0" encoding="ISO-8859-1"?>
<?xml-stylesheet type="text/xsl" href="index.xsl"?>
<class>
	<student>
		<name>leo</name>
		<age>29</age>
		<height>183</height>
	</student>
	<student>
		<name>maggie</name>
		<age>26</age>
		<height>156</height>
	</student>
	<student>
		<name>wade</name>
		<age>32</age>
		<height>176</height>
	</student>
    <student>
		<name>vince</name>
		<age>41</age>
		<height>169</height>
	</student>
    <student>
		<name>yaoming</name>
		<age>44</age>
		<height>226</height>
	</student>
</class>
```

```xml
<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0"
xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
<xsl:template match="/">
    <xsl:for-each select="class/student">
	  <xsl:sort select="age"/>
	  <xsl:if test="age&gt;30">
      <xsl:value-of select="name"/>
      <xsl:value-of select="age"/>
	  </xsl:if>
    </xsl:for-each>
</xsl:template>
</xsl:stylesheet>
```

```xml
<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0"
xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
<xsl:template match="/">
    <xsl:for-each select="class/student">
	  <xsl:sort select="age"/>
	  <xsl:if test="age&gt;30">
        <!--年龄大于30为首要条件 -> 身高低于175输出name&age, 否则仅仅输出height -->
		<xsl:choose> 
		  <xsl:when test="height &lt; 175">
			<xsl:value-of select="name"/>,
			<xsl:value-of select="age"/>.
		  </xsl:when>
		  <xsl:otherwise>
			<xsl:value-of select="height"/>.
		  </xsl:otherwise>
		</xsl:choose>
	  </xsl:if>
    </xsl:for-each>
</xsl:template>
</xsl:stylesheet>
```

- eg: 第一个匹配根节点，第二个匹配Author节点

  - ```xml
    <xsl:template match="/">
        Article - <xsl:value-of select="/Article/Title"/>
        Authors: <xsl:apply-templates select="/Article/Authors/Author"/>
    </xsl:template>
    
    <xsl:template match="Author">
        - <xsl:value-of select="." />
    </xsl:template>
        
    ```

### <xsl:call-template>

- ```xml
  <xsl:call-template name=NAME>
    <xsl:with-param> [optional]
  </xsl:call-template>
  ```

- The `<xsl:call-template>` element invokes a named template.

- 相当于一个函数，在主模板中进行调用

  

### <xsl:copy>

- ```
  The <xsl:copy> element transfers a shallow copy (the node and any associated namespace node) of the current node to the output document. It does not copy any children or attributes of the current node.
  ```

- ```xml
  <xsl:copy use-attribute-sets=LIST-OF-NAMES>
    TEMPLATE
  </xsl:copy>
  ```

- ```xml
  <xsl:template match="node()|@*">
          <xsl:copy>
              <xsl:apply-templates select="node()|@*"/>
          </xsl:copy>
      </xsl:template>
  ```

### <xsl:copy-of>

- Inserts subtrees and result tree fragments into the result tree.

- ```xml
  <xsl:copy-of
    select = Expression />
  ```

- 把当前节点和子节点及其值copy一份

  - ```xml
    <xsl:template match="/class">
        <xsl:copy-of select="student"/>
    </xsl:template>
    ```



### <xsl:import>

- Imports another XSLT file.

- ```xml
  <xsl:import
    href = "uri-reference" />
  ```

- ```xml
  <?xml version='1.0'?>
  <xsl:stylesheet version="1.0"
        xmlns:xsl="http://www.w3.org/1999/XSL/Transform" >
  
      <xsl:import href="article.xsl"/>
      <xsl:import href="bigfont.xsl"/>
  
      <xsl:attribute-set name="note-style">
         <xsl:attribute name="font-style">italic</xsl:attribute>
      </xsl:attribute-set>
  
  </xsl:stylesheet>
  ```

### <xsl:include>

- Includes another XSLT file.The `<xsl:include>` element is only allowed as the child of the `<xsl:stylesheet>` element.

- ```xml
  <xsl:include
    href = "uri-reference"/>
  ```

- 引入进来xsl文件的element 如果和当前xsl文件的element重复，他们的顺序是一样的，显示按照上下文顺序执行即可

  - books.xsl

    - ```xml
      <?xml version="1.0" encoding="UTF-8"?>
      <xsl:stylesheet version="3.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
          
          <xsl:output method="xml" omit-xml-declaration="yes" indent="yes"/>
          
          <xsl:template match="/">
              
              <xsl:for-each select="COLLECTION/BOOK">
                  <xsl:apply-templates select="TITLE"/>
                  <xsl:apply-templates select="AUTHOR"/>
                  <xsl:apply-templates select="PUBLISHER"/>
              </xsl:for-each>
          </xsl:template>
          
          <xsl:template match="TITLE">
              Title: <xsl:value-of select="."/>
          </xsl:template>
          
          <xsl:include href="./xslincludefile.xsl" />
          
      </xsl:stylesheet>
      ```

    - xslinclude.xsl

      - ```xml
        <?xml version="1.0" encoding="UTF-8"?>
        <xsl:stylesheet version="3.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
            
            <xsl:output method="xml" omit-xml-declaration="yes" indent="yes"/>
            
            <xsl:template match="TITLE">
                Title - <xsl:value-of select="."/>
            </xsl:template>
        
            <xsl:template match="AUTHOR">
                Author - <xsl:value-of select="."/>
            </xsl:template>
            
            <xsl:template match="PUBLISHER">
                Publisher - <xsl:value-of select="."/>
            </xsl:template>
            
        </xsl:stylesheet>
        ```

    - output

      - ```
                Title - Lover Birds
                Author - Cynthia Randall
                Publisher - Lucerne Publishing
                Title - The Sundered Grail
                Author - Eva Corets
                Publisher - Lucerne Publishing
                Title - Splish Splash
                Author - Paula Thurman
                Publisher - Scootney
        ```

        

## 补充

- <xsl:template match="@*|node()"> 含义是什么

  - @代表匹配attribute，*代表所有，@\*代表匹配所有的attribute

  - node()表示 element, text node, processing instruction or comment.

  - |表示或

  - 常见用法

    - ```xml
      <xsl:template match="@*|node()">
        <xsl:copy><xsl:apply-templates select="@*|node()" /></xsl:copy>
      </xsl:template>
      ```

    - 复制一份input xml作为输出xml