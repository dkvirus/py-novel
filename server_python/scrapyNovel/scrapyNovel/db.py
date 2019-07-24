import pymysql
import scrapyNovel.settings as settings

class Db(object):
    def __init__(self):
        self.connect = pymysql.connect(
            host=settings.MYSQL_HOST,  
            db=settings.MYSQL_DB,           # 数据库名
            user=settings.MYSQL_USER,       # 数据库用户名
            passwd=settings.MYSQL_PASS,     # 数据库密码
            charset='utf8',                 # 编码方式
            use_unicode=True)
        self.cursor = self.connect.cursor()
        self.execute = self.connect.cursor().execute
        self.executemany = self.connect.cursor().executemany
        self.close = self.connect.close
        self.commit = self.connect.commit
        self.rollback = self.connect.rollback

    