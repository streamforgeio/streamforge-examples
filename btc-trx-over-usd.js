const sf = require('streamforge');

var p = sf.Pipeline("ico-parity-compare").withComponent(
	sf.Zip("bitcoin-trx-calculation")
	.withProcess(function(p1, p2) {
		var r = {
			'amount': (p1.amount * p2.body.result.price.last)
		}
        return {"request" : JSON.stringify(r)};
	})
	.withSource(
		sf.Source("btc-raw", sf.DataSourceType.GLOBAL).withConflation(function(s1,s2){
			print("btc-txId:" + s2.txId );
			return {'amount': (s1.amount + s2.amount),'txId':'total' }
		})
	)
	.withSource(
		sf.Source("ico-parity", sf.DataSourceType.GLOBAL, function(s) {
			return 	s.market == 'kraken' &&
					s.ico == 'eth' &&
				s.currency == 'usd';
		})
	).toSink(sf.APISink("api-compare","http://jumphost.streamforge.io:8080/api/trxs",
    {   "http.method":"POST",
        "http.api-key":"8d77f7d14a4864931f15072255fc1b58de8941cd45a8a896ed4ebf99b93d2e33"}))
)

//console.log(JSON.stringify(p));
p.compile();