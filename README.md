# Streamforge Examples

In this repository you can find streamforge samples. In the sample pipelines, the following realtime datasources are used;

- BTC transactions : Bitcoin realtime transactions include the following information ;  
	- Transaction Id
	- sender address
	- receiver address
	- amount 

	Sample Json: 

	~~~javascript
{"txId":"0x3104affda3c52068a1ee1b66bcf48e79ea95199d64146852ea1b38b97d78b229",
"senders":["0x5514290d2c6C85C99dc48118757D961654848dec"],
"receivers":["0x3D6AB64e5787B9e2aBCC3Bb1fc46c2b6f0970FfF"],
"amount":4.3925782804}
~~~
- ETH transactions : Bitcoin realtime transactions include the following information ;  
	- Transaction Id
	- sender address
	- receiver address
	- amount 

	Sample Json: 

	~~~javascript
{"txId":"0x39da3636083de081f762a950a18f156450f86a9501880fdf5134f91a50d3cc23",
"senders":["0x5DD08229EEbD5712d4d1c146048ee3881B42759D"],
"receivers":["0x4ce9a9853f4Ec020fAB21806767db383568c6567"],
"amount":0.04449602}
~~~
- ICO parities : ICO(BTC,ETH) and USD parity information from the following markets;
	- kraken
	- bitfinex
	- coinbase-pro

	It fetches for every 10 seconds.
	
	~~~javascript
	{
	"market":"kraken",
	"ico":"eth",
	"currency":"usd",
	"body":{
			"result":{
				"price":{
					"last":157.67,
					"high":163.08,
					"low":156.29,
					"change":{
						"percentage":0.008055751,
						"absolute":1.26
						}
					},
				"volume":68364.75492044,
				"volumeQuote":10894422.226533784
			},
		"allowance":{
			"cost":11642040,
			"remaining":1731319292
			}
		},
	"dateStr":"2019-05-01T20:50:35.216Z"
	}
	~~~ 
	
## Steps

- Install **streamforge-cli** as a npm package.

~~~bash
npm install -g streamforge-cli
~~~  

- you can list the available commands by **"streamforge --help"**:

~~~bash
localhost:streamforge-examples user$ streamforge --help
Usage: streamforge [options] [command]

Options:
  -h, --help                                   output usage information

Commands:
  pipeline-list
  pipeline-delete <pipelineJSFileName>
  pipeline-add [pipelineJSFileName]
  version-list [pipelineJSFileName]
  version-add [options] <pipelineVersion>
  version-start [options] <pipelineVersion>
  version-stop [options] <pipelineVersion>
  runtime-history [options] <pipelineVersion>
~~~

- deploy runny.js on streamforge. runny.js builds a pipeline that perform a API POST call for every ~5 seconds

~~~bash
localhost:streamforge-examples user$ streamforge pipeline-add runny.js

Adding pipeline runny.js
[winston] Attempt to write logs with no transports {"level":"info","message":"pipelineName:temp"}
[winston] Attempt to write logs with no transports {"level":"debug","message":"folder already exists"}
[winston] Attempt to write logs with no transports {"level":"info","message":"The file was saved!"}

~~~

- list deployed pipelines on streamforge 

~~~bash
localhost:streamforge-examples user$ streamforge pipeline-list

┌────┬───────┬───────────────┐
│ id │ name  │ version count │
├────┼───────┼───────────────┤
│ 1  │ runny │ 1             │
└────┴───────┴───────────────┘
~~~

- list  deployed pipeline versions on streamforge 

~~~bash
localhost:streamforge-examples user$ streamforge version-list runny.js

┌────┬─────────┬─────────┐
│ id │ version │ status  │
├────┼─────────┼─────────┤
│ 2  │ 0.0.1   │ STOPPED │
└────┴─────────┴─────────┘
~~~

- Configure target http server 
	- You can use **mockserver** npm package for http server
	- Change the target **apisink url** in the **runny.js**. 

	~~~bash
	sf.APISink("api-compare","http://jumphost.streamforge.io:8080/api/trxs",
    {   "http.method":"POST",
        "http.api-key":"8d77f7d14a4864931f15072255fc1b58de8941cd45a8a896ed4ebf99b93d2e33"})
	~~~

- start pipeline version 0.0.1 

~~~bash
streamforge version-start -p runny.js 0.0.1
~~~

- on the http server side output will be like ;

~~~bash
Reading from trxs/POST--{"btc-usd-amount":58453.61544495,"eth-usd-amount":7.852500000000001,"date":"2019-05-01T21:14:55.537Z"}.mock file: Not matched
Reading from trxs/POST.mock file: Not matched
Reading from trxs/POST--{"btc-usd-amount":58453.61544495,"eth-usd-amount":7.852500000000001,"date":"2019-05-01T21:14:55.537Z"}.mock file: Not matched
Reading from trxs/POST.mock file: Not matched
Reading from trxs/POST--{"btc-usd-amount":5159.865024306,"eth-usd-amount":0,"date":"2019-05-01T21:15:15.426Z"}.mock file: Not matched
Reading from trxs/POST.mock file: Not matched
Reading from trxs/POST--{"btc-usd-amount":5159.865024306,"eth-usd-amount":0,"date":"2019-05-01T21:15:15.426Z"}.mock file: Not matched
~~~

- stop pipeline version 0.0.1 

~~~bash
streamforge version-stop -p runny.js 0.0.1
~~~
