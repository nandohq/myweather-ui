# myweather-ui
Cliente Angular para API Rest de cadastro de cidades e consulta de previsão do tempo

### Configurando ambiente

A _myweather-ui_ utiliza a API _myweather-api_ para consultar a previsão do tempo. É necessário ter esse serviço rodando para que o client funcione

A _myweather-ui_ utiliza a API [OwnCityFinder](https://gitlab.com/mvysny/owm-city-finder/tree/master/owm-city-finder-server) para consultar as cidades que o usuário está cadastrando, de modo a garantir que estas constem na base da API [OpenWeather](https://openweathermap.org/api) (usada pela _myweather-api_ para consultar a previsão do tempo).
É necessário rodar a imagem Docker do serviço _OwnCityFinder_, (conforme descrito na página do _GitHub_ do projeto) em conjunto com a API _myweather-api_ para obter o correto funcionamento.

Certifique-se de atualizar as referências para os _endpoints_ do backend nas classes de serviço e no arquivo _proxy.config.js_ (para propósitos de execução local, esse arquivo configura um contorno do controle _CORS_ no acesso à API _OwnCityFinder_)
