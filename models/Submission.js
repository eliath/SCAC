var keystone = require('keystone'),
	Types = keystone.Field.Types;

/**
 * Submission Model
 * =============
 */

var Submission = new keystone.List('Submission', {
	nocreate: true,
	noedit: true
});

Submission.add({
	name: { type: Types.Name, required: true },
	email: { type: Types.Email, required: true },
	submissionType: { type: Types.Select, required:true, options: ['Spring Arts', 'Grant Show', 'Living Room Show'] },
	// message: { type: Types.Markdown, required: true },
	description: { type: Types.Markdown, required: true },
	// upload: { type: Types.S3File },
	link: { type: Types.Url},
	createdAt: { type: Date, 'default': Date.now }
});

Submission.schema.pre('save', function(next) {
	this.wasNew = this.isNew;
	next();
});

Submission.schema.post('save', function() {
	if (this.wasNew) {
		this.sendNotificationEmail();
	}
});

Submission.schema.methods.sendNotificationEmail = function(callback) {
	
	if ('function' !== typeof callback) {
		callback = function() {};
	}
	
	var submission = this;
	
	keystone.list('User').model.find().where('isAdmin', true).exec(function(err, admins) {
		
		if (err) return callback(err);
		
		new keystone.Email('submission-notification').send({
			to: admins,
			from: {
				name: 'studentcreativearts.org',
				email: 'contact@studentcreativearts.org'
			},
			subject: 'New Submission to studentcreativearts.org',
			submission: submission
		}, callback);
		
	});
	
};

Submission.defaultSort = '-createdAt';
Submission.defaultColumns = 'name, email, submissionType, createdAt';
Submission.register();
