const sf = require('streamforge');

var p = sf.Pipeline("ico-parity-compare").withComponent(
	sf.Zip("ethereum-trx-calculation")
	.withProcess(function(p1, p2) {
		var finalTrxs = [];
		var trxCount = 1;
		if (p1.trxs != undefined){
			p1.trxs.sort(function (a,b) {
				if (a.amount > b.amount) {
					return -1;
				}
				if (b.amount > a.amount) {
					return 1;
				}
				return 0;
			})
			trxCount = p1.trxs.length;
			finalTrxs = p1.trxs.slice(0,10);
		} else {
			finalTrxs.push({'id' : p1.txId, 'amount' : p1.amount})
		}
		

		var r = {
			'amount': (p1.amount * p2.body.result.price.last),
			'topTrxs' : finalTrxs,
			'trxCount' : trxCount
		}
        return {"request" : JSON.stringify(r) };
	})
	.withSource(
		sf.Source("eth-pending", sf.DataSourceType.GLOBAL).withConflation(function(s1,s2){
			//print("s1 amount:"  + s1.txId  + " amount:" + s1.amount);
			//print("s2 amount:"  + s2.txId  + " amount:" + s2.amount);
			var trxs = [];
			if (s1.trxs == undefined){
				trxs.push({'id' : s1.txId, 'amount' : s1.amount});
			} else {
				trxs = s1.trxs;
			}
			trxs.push({'id' : s2.txId, 'amount' : s2.amount});
			return {'amount': (s1.amount + s2.amount),'txId':'total','trxs' : trxs};
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
