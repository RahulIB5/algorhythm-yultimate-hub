import { body, validationResult } from "express-validator";

// Error handler for validation (can be used as middleware after validateTournament)
export const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: "Validation failed",
      errors: errors.array()
    });
  }
  next();
};

// Validation for tournament creation
export const validateTournament = [
  body('name')
    .notEmpty()
    .withMessage('Tournament name is required')
    .isLength({ min: 2, max: 100 })
    .withMessage('Tournament name must be between 2 and 100 characters')
    .trim(),
  
  body('startDate')
    .notEmpty()
    .withMessage('Start date is required')
    .isISO8601()
    .withMessage('Please provide a valid start date')
    .custom((value) => {
      const startDate = new Date(value);
      const now = new Date();
      
      // Allow today's date, just ensure it's not in the past
      if (startDate < now && startDate.toDateString() !== now.toDateString()) {
        throw new Error('Start date cannot be in the past');
      }
      return true;
    }),

  body('endDate')
    .notEmpty()
    .withMessage('End date is required')
    .isISO8601()
    .withMessage('Please provide a valid end date')
    .custom((value, { req }) => {
      const endDate = new Date(value);
      const startDate = new Date(req.body.startDate);
      
      if (endDate < startDate) {
        throw new Error('End date must be after start date');
      }
      return true;
    }),

  body('location')
    .notEmpty()
    .withMessage('Location is required')
    .isLength({ min: 2, max: 200 })
    .withMessage('Location must be between 2 and 200 characters')
    .trim(),
  
  body('maxTeams')
    .notEmpty()
    .withMessage('Maximum teams is required')
    .isInt({ min: 2, max: 64 })
    .withMessage('Maximum teams must be between 2 and 64'),

  body('division')
    .notEmpty()
    .withMessage('Division is required')
    .isIn(['Open Division', 'Women\'s Division', 'Mixed Division', 'Open & Women\'s', 'Youth Division'])
    .withMessage('Please select a valid division'),
  
  body('format')
    .notEmpty()
    .withMessage('Tournament format is required')
    .isIn(['pool-play-bracket', 'single-elimination', 'double-elimination', 'round-robin', 'swiss'])
    .withMessage('Please select a valid tournament format'),

  body('prizePool')
    .notEmpty()
    .withMessage('Prize pool is required')
    .isLength({ max: 50 })
    .withMessage('Prize pool must be less than 50 characters')
    .trim(),

  body('description')
    .notEmpty()
    .withMessage('Description is required')
    .isLength({ min: 10, max: 1000 })
    .withMessage('Description must be between 10 and 1000 characters')
    .trim(),
  
  body('rules')
    .notEmpty()
    .withMessage('Tournament rules are required')
    .isLength({ min: 10, max: 2000 })
    .withMessage('Rules must be between 10 and 2000 characters')
    .trim(),

  body('registrationDeadline')
    .notEmpty()
    .withMessage('Registration deadline is required')
    .isISO8601()
    .withMessage('Please provide a valid registration deadline')
    .custom((value, { req }) => {
      const deadline = new Date(value);
      const startDate = new Date(req.body.startDate);
      
      // Registration deadline should be before start date
      if (deadline >= startDate) {
        throw new Error('Registration deadline must be before the tournament start date');
      }
      return true;
    })
];