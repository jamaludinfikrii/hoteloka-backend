use hoteloka;
select * from rooms;

-- room yang booked tanggal 5 harusnya ada 4

-- 5 - 8
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



DELIMITER $$
CREATE FUNCTION get_count_rooms_available (
	search_date DATETIME,
    id_to_search INT,
    count_rooms INT
)

RETURNS INT
DETERMINISTIC
BEGIN
    declare total_booked INT;
	declare count_rooms_available INT;
    
    select COUNT(get_id_room_booked(search_date,begin_book_date,end_book_date,rooms_id)) into total_booked
	from transactions 
	where get_id_room_booked(search_date,begin_book_date,end_book_date,rooms_id) = id_to_search;
    
    set count_rooms_available = count_rooms - total_booked;
    return count_rooms_available;
    
END $$

DELIMITER ;


select *,get_count_rooms_available('2020-11-06',id,room_counts) as room_available from rooms
having room_available > 0
;

select h.id,h.name, min(r.price) as price,address, phone,star,hi.url from hotels h 
join rooms r on h.id = r.hotels_id
join hotel_images hi on hi.hotels_id = h.id 
where h.id in(
select hotels_id from rooms where id in(
select get_room_id_available('2020-10-5',id,room_counts) from rooms)) GROUP BY h.name; 

SELECT h.id,h.`name`, min(r.price) as price,address, phone,star,hi.url FROM hotels h JOIN rooms r on h.id = r.hotels_id JOIN hotel_images hi on hi.hotels_id = h.id GROUP BY h.`name`;

select * from transactions;

SELECT r.id,r.`name`, guest_count,price,hotels_id,room_counts, GROUP_CONCAT(DISTINCT(ri.url)) as room_image,get_count_rooms_available('2020-11-05',r.id,room_counts) as room_left FROM rooms r JOIN room_images ri on r.id = ri.rooms_id WHERE hotels_id = 1 GROUP BY rooms_id;





DELIMITER $$
CREATE FUNCTION loop_on_date (
	first_date DATE,
    last_date DATE
)

RETURNS INT
DETERMINISTIC
BEGIN
    declare total_loop INT default 1;
	
    WHILE first_date < last_date DO
		set first_date = DATE_ADD(first_date, INTERVAL 1 DAY);
        set total_loop = total_loop + 1;
    END WHILE;
    
    return (total_loop);
END $$

DELIMITER ;


select loop_on_date('2020-11-01','2020-11-10');





DELIMITER $$
CREATE FUNCTION loop_fn_2 (
	beginning INT,
    ending INT
)

RETURNS INT
DETERMINISTIC
BEGIN
    declare counter INT default 0;
	
    WHILE beginning < ending DO
		set counter = counter + 1;
        set beginning = beginning + 1;
    END WHILE;
    
    return (counter);
END $$
	
DELIMITER ;


select loop_fn_2(1,10);



set @a = '2020-11-05';

select DATE_ADD(@a, INTERVAL 1 HOUR);



