<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
  <xsl:output method="html" version="1.0" encoding="UTF-8" indent="yes"/>
  
  <xsl:template match="/">
    <html>
      <head>
        <title><xsl:value-of select="/rss/channel/title"/></title>
        <style type="text/css">
          body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 900px;
            margin: 0 auto;
            padding: 20px;
            background-color: #f4f7fe;
          }
          header {
            background-color: #4a6cf7;
            color: white;
            padding: 20px;
            border-radius: 8px;
            margin-bottom: 20px;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
          }
          h1 {
            margin: 0;
            font-size: 24px;
          }
          .description {
            color: rgba(255, 255, 255, 0.9);
            margin-top: 10px;
            font-size: 16px;
          }
          .channel-meta {
            background-color: white;
            border-radius: 8px;
            padding: 15px;
            margin-bottom: 20px;
            font-size: 14px;
            color: #666;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
          }
          .meta-item {
            margin-bottom: 5px;
          }
          .item {
            background-color: white;
            border-radius: 8px;
            padding: 20px;
            margin-bottom: 15px;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
          }
          .item-title {
            margin-top: 0;
            font-size: 18px;
            color: #4a6cf7;
          }
          .item-meta {
            font-size: 12px;
            color: #888;
            margin-top: 15px;
          }
          .back-link {
            display: inline-block;
            margin-top: 20px;
            color: #4a6cf7;
            text-decoration: none;
            font-weight: bold;
          }
          .back-link:hover {
            text-decoration: underline;
          }
        </style>
      </head>
      <body>
        <header>
          <h1><xsl:value-of select="/rss/channel/title"/></h1>
          <div class="description">
            <xsl:value-of select="/rss/channel/description"/>
          </div>
        </header>
        
        <div class="channel-meta">
          <div class="meta-item">
            <strong>语言 | Language:</strong> <xsl:value-of select="/rss/channel/language"/>
          </div>
          <div class="meta-item">
            <strong>最后更新 | Last Update:</strong> <xsl:value-of select="/rss/channel/lastBuildDate"/>
          </div>
          <div class="meta-item">
            <strong>订阅链接 | Feed URL:</strong> <a href="{/rss/channel/atom:link/@href}"><xsl:value-of select="/rss/channel/atom:link/@href"/></a>
          </div>
        </div>
        
        <div class="items">
          <xsl:for-each select="/rss/channel/item">
            <div class="item">
              <h2 class="item-title">
                <a href="{link}"><xsl:value-of select="title"/></a>
              </h2>
              <div class="item-content">
                <xsl:value-of select="description"/>
              </div>
              <div class="item-meta">
                <strong>发布时间 | Published:</strong> <xsl:value-of select="pubDate"/>
              </div>
            </div>
          </xsl:for-each>
        </div>
        
        <a href="{/rss/channel/link}" class="back-link">返回网站 | Back to Website</a>
      </body>
    </html>
  </xsl:template>
</xsl:stylesheet> 