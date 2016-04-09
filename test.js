var should = require('should');

var mandrill = require('./index');

var apiKey = process.env.mandrillApiKey;


describe('Mandrill adapter test', function() {
	this.timeout(5000);

	it('Send test', function(done) {
		mandrill.send({
      apiKey: apiKey,
      to: [{name: 'Gianluca', email: 'gianluca.pengo@gmail.com'}],
      from: {name: 'Kademy', email: 'noreply@kademy.it'},
      subject: 'Test Mandrill adapter',
      html: '<h1>Test Mandrill adapter</h1><p>Test body</p>',
      //text: 'text',
    	//attachments: 'attachments',
      //images: 'images',
    	//tags: 'tags',
      //headers: 'headers',
      //metadata: 'metadata',
		}, function(err, res){
			should.not.exist(err);

      res.should.be.instanceof(Array);
      res[0].should.have.property('status');

			done();
		});
	});
});
