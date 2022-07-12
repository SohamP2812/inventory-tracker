if [ "$REPL" == "true" ]
then
pg_ctl stop

initdb
cp postgresql.conf.tpl data/postgresql.conf

socker_dir="\/home\/runner\/${REPL_SLUG}\/postgres"

sed -i "s/replace_unix_dir/${socker_dir}/" data/postgresql.conf

pg_ctl -l /home/runner/${REPL_SLUG}/postgresql.log start
fi

createdb -h 127.0.0.1
psql -h 127.0.0.1 -c "drop database inventory;"
psql -h 127.0.0.1 -c "create database inventory;"

cd server 

npm run start