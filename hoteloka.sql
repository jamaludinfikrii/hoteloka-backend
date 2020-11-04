use hoteloka;
select * from rooms;

-- room yang booked tanggal 5 harusnya ada 4

-- 5
-- 1 - 7 ==> true
-- 5 - 6 ==> true
-- 6 - 7 ==> false
-- 4 - 5 ==> false

-- fn (5, 4, 5) 
-- if(searchDate >= startDate && searchDate < endDate) return true : false


DELIMITER $$
CREATE FUNCTION get_id_room_booked (
	search_date DATETIME,
    check_in_date DATETIME,
    check_out_date DATETIME,
    id INT
)

RETURNS INT
DETERMINISTIC
BEGIN
	declare id_room INT;
    if(DATE(search_date) >= DATE(check_in_date) and DATE(search_date) < DATE(check_out_date))
		then set id_room = id;
	else
		set id_room = 0;
    end if;
    return (id_room);
END $$

DELIMITER ;


-- room booked at 5 nov
select * from rooms where id in
(select get_id_room_booked('2020-11-05',begin_book_date,end_book_date,rooms_id) from transactions);


-- get room available in spesific date 5 - nov -2020 (9 rooms)
-- ditotal room yang udah ke book
select COUNT(get_id_room_booked('2020-11-05',begin_book_date,end_book_date,rooms_id))
	from transactions 
	where get_id_room_booked('2020-11-05',begin_book_date,end_book_date,rooms_id) = 1;


DELIMITER $$
CREATE FUNCTION get_room_id_available (
	search_date DATETIME,
    id_to_search INT,
    count_rooms INT
)

RETURNS INT
DETERMINISTIC
BEGIN
    declare total_booked INT;
	declare id_room INT;
    
    select COUNT(get_id_room_booked(search_date,begin_book_date,end_book_date,rooms_id)) into total_booked
	from transactions 
	where get_id_room_booked(search_date,begin_book_date,end_book_date,rooms_id) = id_to_search;
    
    if total_booked >= count_rooms
		then set id_room = 0;
	else
		set id_room = id_to_search;
	end if;
		
	return (id_room);
    
END $$

DELIMITER ;

select get_room_id_available('2020-11-05',id,room_counts) as available_rooms_id from rooms;

select * from transactions;












set @name = "";

select name into @name from rooms where id = 1;

select @name;






