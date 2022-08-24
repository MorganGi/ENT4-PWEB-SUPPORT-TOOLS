# ENT4-PWEB-Backend

1. mkdir faq
1. cd ./faq
1. sudo git clone https://github.com/MorganGi/ENT4-PWEB-Frontend.git
1. sudo git clone https://github.com/MorganGi/ENT4-PWEB-Backend.git
1. sudo mv ./ENT4-PWEB-Frontend/docker-compose.yml .
1. sudo touch ./ENT4-PWEB-Frontend/.env
1. sudo vim ./ENT4-PWEB-Frontend/.env --> PORT=8081
1. CHANGE IP TO HOST IP IN :
1. • ./ENT4-PWEB-Frontend/src/componenets2/ip.backend.js
1. • ./ENT4-PWEB-Backend/server.js
1. docker-compose up -d --build
