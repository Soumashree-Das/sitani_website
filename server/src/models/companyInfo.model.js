import mongoose from "mongoose";

const companyInfoSchema = new mongoose.Schema({
    aboutUs: {
        mission: {
            type: String,
            required: true
        },
        vision: {
            type: String,
            required: true
        },
        title: {
            type: String,
            required: true
        },
        location: {
            address: String,
            city: String,
            country: String,
            timezone: String
        },
        imageUrl: String,
        lastUpdated: Date
    },
    contactInfo: {
        email: {
            type: String,
            // required: true, // optional based on your needs
            validate: {
                validator: function (v) {
                    // Comprehensive email regex pattern
                    return /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(v);
                },
                message: props => `${props.value} is not a valid email address!`
            },
            lowercase: true // optional: converts email to lowercase
        },
        phoneNumbers: {
            type: [{
                type: String,
                validate: {
                    validator: function (v) {
                        // Basic phone number validation regex (adjust as needed)
                        return /^[+]?[(]?[0-9]{1,4}[)]?[-\s./0-9]{7,}$/.test(v);
                    },
                    message: props => `${props.value} is not a valid phone number!`
                }
            }],
            validate: {
                validator: function (v) {
                    return v.length <= 3;
                },
                message: 'You can add at most 3 phone numbers!'
            },
            default: [] // Default to empty array
        },
        availableHours: {
            weekdays: {
                from: { type: String, default: '09:00' },
                to: { type: String, default: '17:00' }
            },
            weekends: {
                from: String,
                to: String
            }
        },
        lastUpdated: Date
    }
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

// Add indexes for better query performance
companyInfoSchema.index({ 'aboutUs.sections.section': 1 });
companyInfoSchema.index({ 'contactInfo.departments.department': 1 });

const CompanyInfo = mongoose.model('CompanyInfo', companyInfoSchema);

export default CompanyInfo;