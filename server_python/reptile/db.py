import pymysql.cursors
from reptile.config import host, user, password, db

class Db(object):
    def __init__(self):
        self.connection = pymysql.connect(host=host,
            user=user, password=password, db=db,
            charset='utf8', cursorclass=pymysql.cursors.DictCursor)

    def insertOne(self, sql, params=()):
        try:
            with self.connection.cursor() as cursor:
                cursor.execute(sql, params)
            self.connection.commit()
        except Exception as e:
            self.connection.rollback()
            print(e)

    def insertMany(self, sql, params=()):
        try:
            with self.connection.cursor() as cursor:
                cursor.executemany(sql, params)
            self.connection.commit()
        except Exception as e:
            self.connection.rollback()
            print(e)

    def selectOne(self, sql, params=()):
        try:
            with self.connection.cursor() as cursor:
                cursor.execute(sql, params)
                result = cursor.fetchone()
                return result 
        except Exception as e:
            print(e)

    def selectAll(self, sql, params=()):
        try:
            with self.connection.cursor() as cursor:
                cursor.execute(sql, params)
                result = cursor.fetchall()
                return result 
        except Exception as e:
            print(e)

    def removeOne(self, sql, params=()):
        try:
            with self.connection.cursor() as cursor:
                cursor.execute(sql, params)
                self.connection.commit()
        except Exception as e:
            self.connection.rollback()
            print(e)

    def updateOne(self, sql, params=()):
        try:
            with self.connection.cursor() as cursor:
                cursor.execute(sql, params)
                self.connection.commit()
        except Exception as e:
            self.connection.rollback()
            print(e)

    def close(self):
        self.connection.close()

def test():
    db = Db()
    db.insertOne('insert into gysw_classify (`path`, `desc`) values (%s, %s)', ("xiuzhenxiaoshuo", "修真小说"))
    result = db.selectAll('select * from gysw_classify')
    db.close()
    print(result)

if __name__ == '__main__':
    test()    