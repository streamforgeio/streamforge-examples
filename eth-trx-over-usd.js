const sf = require('streamforge');

var p = sf.Pipeline("ico-parity-compare").withComponent(
	sf.Zip("ethereum-trx-calculation")
	.withProcess(function(p1, p2) {
		var r = {
			'amount': (p1.amount * p2.body.result.price.last)
		}
		//print("amount:"  +p1.amount );
        return {"request" : JSON.stringify(r)};
	})
	.withSource(
		sf.Source("eth-pending", sf.DataSourceType.GLOBAL).withConflation(function(s1,s2){
			//print("s1 amount:"  + s1.txId  + " amount:" + s1.amount);
			//print("s2 amount:"  + s2.txId  + " amount:" + s2.amount);
			return {'amount': (s1.amount + s2.amount),'txId':'total' }
		})
	)
	.withSource(
		sf.Source("ico-parity", sf.DataSourceType.GLOBAL, function(s) {
			return 	s.market == 'kraken' &&
					s.ico == 'eth' &&
				s.currency == 'usd';
		})
	).toSink(sf.LogSink("eth-usd-out"))
)

//console.log(JSON.stringify(p));
p.compile();
