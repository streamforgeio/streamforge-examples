const sf = require('streamforge');

var p = sf.Pipeline("ico-parity-compare").withComponent(
	sf.Zip("bitcoin-calculation")
	.withProcess(function(p1, p2) {
		var r = {
			'amount': (p1.amount * p2.body.result.price.last)
		}
		return r;
	})
	.withSource(
		sf.Source(sf.PredefinedSources.BITCOIN_TRANSACTIONS).withConflation(function(s1,s2){
			print("btc-txId:" + s2.txId );
			return {'amount': (s1.amount + s2.amount),'txId':'total' }
		})
	)
	.withSource(
		sf.Source(sf.PredefinedSources.ICO_PARITY, function(s) {
			return	s.market == 'kraken' &&
					s.ico == 'btc' &&
				s.currency == 'usd' ;
		})
	)
).withComponent(
	sf.Zip("ethereum-calculation")
	.withProcess(function(p1, p2) {
		var r = {
			'amount': (p1.amount * p2.body.result.price.last)
		}
		return r;
	})
	.withSource(
		sf.Source(sf.PredefinedSources.ETHEREUM_PENDING_TRANSACTIONS).withConflation(function(s1,s2){
			print("eth-txId:" + s2.txId );
			return {'amount': (s1.amount + s2.amount),'txId':'total' }
		})
	)
	.withSource(
		sf.Source(sf.PredefinedSources.ICO_PARITY, function(s) {
			return 	s.market == 'kraken' &&
					s.ico == 'eth' &&
				s.currency == 'usd';
		})
	)
).withComponent(
    sf.Zip("compare", true)
	.withProcess(function(p1, p2) {
		var amount = {
			"btc-usd-amount": p1.amount,
            "eth-usd-amount": p2.amount,
            "date" : new Date()
        };
		print("json : " + amount);
        return {"request" : JSON.stringify(amount)};
	}).withSource(sf.Source("bitcoin-calculation"))
	.withSource(sf.Source("ethereum-calculation"))
	.toSink(sf.APISink("api-compare","http://jumphost.streamforge.io:8080/api/trxs",
    {   "http.method":"POST",
        "http.api-key":"8d77f7d14a4864931f15072255fc1b58de8941cd45a8a896ed4ebf99b93d2e33"}))
)

//console.log(JSON.stringify(p));
p.compile();