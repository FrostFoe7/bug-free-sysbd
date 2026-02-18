-- Create a function to handle new user creation from Supabase Auth
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public."User" (
    id,
    email,
    username,
    created_at,
    updated_at,
    verified
  )
  values (
    new.id,
    new.email,
    split_part(split_part(new.email, '@', 1), '.', 1),
    now(),
    now(),
    true
  );
  return new;
end;
$$ language plpgsql security definer;

-- Create trigger to sync auth.users to public.User table
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Create a function to handle user updates from Supabase Auth
create or replace function public.handle_user_update()
returns trigger as $$
begin
  update public."User"
  set
    email = new.email,
    updated_at = now()
  where id = new.id;
  return new;
end;
$$ language plpgsql security definer;

-- Create trigger to sync auth.users updates to public.User table
create trigger on_auth_user_updated
  after update on auth.users
  for each row execute procedure public.handle_user_update();
