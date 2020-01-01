# Streamforge Examples

In this repository you can find streamforge samples. 

In the sample pipelines, the following real time datasources are used;

- BTC transactions : Bitcoin realtime transactions include the following information ;  
	- transaction id
	- sender address
	- receiver address
	- amount 

	Sample Json: 

	~~~javascript
{"txId":"e77462d8ae764efab43822e438ef273a85f80adedf326a58494d460672d7409b",
"senders":["1E8fXPwkXBWFkiRF2jj1v9fUdESXyAEofe"],
"receivers":["33yeyQThCEkqj6qot1tB94kRJWZiUiPXxQ","bc1qpwm7adceuwxd7ldjwap6tzq04lc85ekvj4g3kp"],
"amount":0.00614802}
~~~
- ETH transactions : Bitcoin realtime transactions include the following information ;  
	- transaction id
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
	
## QuickStart

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

- deploy eth-trx-over-usd.js on streamforge-examples. eth-trx-over-usd.js builds a pipeline that prints total eth transactions USD amount in every 30 seconds

~~~bash
localhost:streamforge-examples user$ streamforge pipeline-add eth-trx-over-usd.js

Adding pipeline runny.js
[winston] Attempt to write logs with no transports {"level":"info","message":"pipelineName:temp"}
[winston] Attempt to write logs with no transports {"level":"debug","message":"folder already exists"}
[winston] Attempt to write logs with no transports {"level":"info","message":"The file was saved!"}

~~~

- list deployed pipelines on streamforge 

~~~bash
localhost:streamforge-examples user$ streamforge pipeline-list

┌────┬─────-----------──┬───────────────┐
│ id │ name             │ version count │
├────┼─────-----------──┼───────────────┤
│ 1  │ eth-trx-over-usd │ 1             │
└────┴──────-----------─┴───────────────┘
~~~

- list  deployed pipeline versions on streamforge 

~~~bash
localhost:streamforge-examples user$ streamforge version-list eth-trx-over-usd.js

┌────┬─────────┬─────────┐
│ id │ version │ status  │
├────┼─────────┼─────────┤
│ 2  │ 0.0.1   │ STOPPED │
└────┴─────────┴─────────┘
~~~


- start pipeline version 0.0.1 

~~~bash
streamforge version-start -p eth-trx-over-usd.js 0.0.1
~~~

- on the system out of pipeline will be like ;

~~~bash
17:53:36 INFO  JSEngine - amount : 55577.337635423086

17:53:36 INFO  LogSink - [alias=eth-usd-out]{"amount":55577.337635423086}

17:53:37 INFO  JSEngine - amount : 0

17:53:37 INFO  LogSink - [alias=eth-usd-out]{"amount":0}

17:54:46 INFO  JSEngine - amount : 0

17:54:46 INFO  LogSink - [alias=eth-usd-out]{"amount":0}

17:54:46 INFO  JSEngine - amount : 35511.69528436845

17:54:46 INFO  LogSink - [alias=eth-usd-out]{"amount":35511.69528436845}

17:55:56 INFO  JSEngine - amount : 40.92

17:55:56 INFO  LogSink - [alias=eth-usd-out]{"amount":40.92}

17:55:56 INFO  JSEngine - amount : 37078.618743495885

17:55:56 INFO  LogSink - [alias=eth-usd-out]{"amount":37078.618743495885}

17:57:08 INFO  JSEngine - amount : 0

17:57:08 INFO  LogSink - [alias=eth-usd-out]{"amount":0}
~~~

- stop pipeline version 0.0.1 

~~~bash
streamforge version-stop -p eth-trx-over-usd.js 0.0.1
~~~
