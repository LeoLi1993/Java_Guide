# XSLT

## XSLT 使用 XPath

- XSLT 使用 XPath 在 XML 文档中查找信息

### 它如何工作

- 在转换过程中，XSLT **使用 XPath 来定义源文档中可匹配一个或多个预定义模板的部分**。一旦匹配被找到，XSLT 就会把源文档的匹配部分转换为结果文档。

## 元素

- <xsl:template>
  - XSL 样式表由**一个或多套被称为模板**（template）的规则组成。
  - 每个模板含有当某个指定的节点被匹配时所应用的规则。
- <xsl:value-of>
  - 提取某个 XML 元素的值，并把值添加到转换的输出流中

- <xsl:for-each select="xxx">
  - 对xxx节点进行循环

- <xsl:for-each select="xxx[name != 'test']">
  - **过滤：**遍历xxx节点，并且把name是test的xxx节点过滤掉
  - 过滤运算符
    - =
    - !=
    -  &lt；
    - &gt；
- <xsl:sort select="age">
  - 对结果集进行排序

- <xsl:if test="name=leo">
  - name为leo的才操作
- <xsl:choose>和<xsl:when> 和<xsl:otherwise>
  - 用来表示多重条件测试
- <xsl:apply-template>
  - <xsl:apply-templates> 元素可把一个模板应用于当前的元素或者当前元素的子节点。
    - 假如我们向 <xsl:apply-templates> 元素添加一个 select 属性，此元素就会仅仅处理与属性值匹配的子元素。我们可以使用 select 属性来规定子节点被处理的顺序。
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

