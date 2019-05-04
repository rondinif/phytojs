# see:
# /Users/ronda/projects/learning-testing-frameworks/lab06-mountebank/mountebank-samples/README-ronda-so-test.md


curl -i -X POST -H 'Content-Type: application/json' http://127.0.0.1:2525/imposters --data '{
  "port": 6569,
  "protocol": "http",
  "name": "wikidata-sparql",
  "stubs": [
    {
      "responses": [
        {
          "proxy": {
            "to": "https://query.wikidata.org",
            "mode": "proxyOnce",
            "predicateGenerators": [
              {
                "matches": {
                  "method": true,
                  "path": true,
                  "query": true
                }
              }
            ]
          }
        }
      ]
    }
  ]
}'

curl -i -X POST -H 'Content-Type: application/json' http://127.0.0.1:2525/imposters --data '{
  "port": 6568,
  "protocol": "http",
  "name": "wikidata",
  "stubs": [
    {
      "responses": [
        {
          "proxy": {
            "to": "https://www.wikidata.org/",
            "mode": "proxyOnce",
            "predicateGenerators": [
              {
                "matches": {
                  "method": true,
                  "path": true,
                  "query": true
                }
              }
            ]
          }
        }
      ]
    }
  ]
}'
