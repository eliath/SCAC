var keystone = require('keystone'),
	Submission = keystone.list('Submission');

exports = module.exports = function(req, res) {
	
	var view = new keystone.View(req, res),
		locals = res.locals;
	
	// Set locals
	locals.section = 'submit';
	locals.submissionTypes = Submission.fields.submissionType.ops;
	locals.formData = req.body || {};
	locals.validationErrors = {};
	locals._submitted = false;
	
	// On POST requests, add the Submission item to the database
	view.on('post', { action: 'submission' }, function(next) {
		
		var newSubmission = new Submission.model(),
			updater = newSubmission.getUpdateHandler(req);
		
		updater.process(req.body, {
			flashErrors: true,
			fields: 'name, email, phone, submissionType, description, upload, link',
			errorMessage: 'There was a problem processing your submission:'
		}, function(err) {
			if (err) {
				locals.validationErrors = err.errors;
			} else {
				locals._submitted = true;
			}
			next();
		});
		
	});
	
	view.render('submit');
	
};
