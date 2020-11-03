-- MYSQL DATE TYPE

-- DATE = 03 - Nov -2020
-- DATETIME = 03 - Nov -2020 : 10 : 10 : 15


-- DATETIME VS TIMESTAMP
-- date format mysql YYYY-MM-DD HH-MM-SS
use date_type_tutorial;
select * from datetime_vs_timestamp;

-- DATE FUNCTIONS 
-- NOW()
set @bebas = NOW();
select @bebas;

-- CARA FILTER BY DATE
select * from test where DATE(created_at) = '2020-11-04';
select * from test where HOUR(created_at) = '10';

select DAY(created_at), MONTH(created_at),YEAR(created_at),TIME(created_at) from test;

SELECT 
    HOUR(created_at),
    MINUTE(created_at),
    SECOND(created_at),
    DAY(created_at),
    WEEK(created_at),
    MONTH(created_at),
    QUARTER(created_at),
    YEAR(created_at)
    from test;


-- DATE FORMATTING
select * , date_format(created_at, '%a, %D %b %Y') as tanggal from test;

-- DATE ADD
select *, date_add(created_at, INTERVAL 30 MINUTE) from test;

-- DATE DIFF

select *,datediff(created_at, NOW()) from test;






