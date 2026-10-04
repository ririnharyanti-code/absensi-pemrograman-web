create extension if not exists pgcrypto;
create table students(id uuid primary key default gen_random_uuid(), npm text unique not null, name text not null, created_at timestamptz default now());
create table meetings(id uuid primary key default gen_random_uuid(), course_name text default 'Pemrograman Web', meeting_number int not null, date date not null, start_time time, end_time time,
 status text not null default 'open' check (status in ('open','closed')), qr_token text unique not null default encode(gen_random_bytes(6),'hex'), created_at timestamptz default now());
create table attendances(id uuid primary key default gen_random_uuid(), meeting_id uuid not null references meetings on delete cascade, student_id uuid not null references students on delete cascade,
 status text not null check (status in ('hadir','izin','sakit','alpa')), attendance_time timestamptz not null default now(), created_at timestamptz default now(), unique(meeting_id, student_id));
-- RLS aktif tanpa policy: anon tidak bisa akses tabel langsung, hanya lewat fungsi di bawah.
alter table students enable row level security; alter table meetings enable row level security; alter table attendances enable row level security;
insert into students(npm,name) values ('24311134','Ririn Haryanti'),('24311069','Bunga Citra Lestari'),('24311096','Dhara Piolita'),('24311063','Ahmad Sultan Wira Negara'),('24311067','Aris Triantoro'),('24311062','Ahad Fahmi Faizi'),('24311121','Muhammad Arya Putra');
insert into meetings(meeting_number,date) values (1,'2026-10-04');

create function get_meeting(t text default null) returns json language sql security definer as $$
 select row_to_json(m) from (select course_name, meeting_number, date, status, qr_token from meetings
 where t is null or qr_token=t order by date desc, meeting_number desc limit 1) m $$;
create function search_students(q text) returns table(name text, npm text) language sql security definer as $$
 select name, npm from students where length(trim(q))>=2 and (name ilike '%'||trim(q)||'%' or npm like trim(q)||'%') order by name limit 6 $$;
create function submit_attendance(t text, n text, s text) returns json language plpgsql security definer as $$
declare m meetings; st students;
begin
 select * into m from meetings where qr_token=t; if not found then return json_build_object('error','Pertemuan tidak ditemukan.'); end if;
 if m.status<>'open' then return json_build_object('error','Absensi saat ini ditutup.'); end if;
 select * into st from students where npm=n; if not found then return json_build_object('error','NPM tidak valid.'); end if;
 if s not in ('hadir','izin','sakit','alpa') then return json_build_object('error','Status tidak valid.'); end if;
 insert into attendances(meeting_id,student_id,status) values (m.id,st.id,s);
 return json_build_object('ok',true,'name',st.name,'time',now());
exception when unique_violation then return json_build_object('error','Anda sudah melakukan absensi untuk pertemuan ini.');
end $$;
