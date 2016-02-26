var mongoose = require('../helpers/dbconnection').mongoose;

var ENUM_CATEGORY = require('../helpers/global').ENUM_CATEGORY;
var ENUM_SOURCE = require('../helpers/global').ENUM_SOURCE;

var ThingSchema = new mongoose.Schema({
    title: { type: String, required: true },
    tags: { type: Array, required: false, default: [] },
    poster: { type: String, required: true },
    content: { type: String, required: false, default: '' },
    creator: { type: String, required: true },
    createtime: { type: Date, required: true, default: Date.now },
    updatetime: { type: Date, required: true, default: Date.now }
}, { collection: 'thing' });
ThingSchema.static('findAll', function (callback) {
    return this.find(callback);
});
ThingSchema.static('findByT', function (tid, callback) {
    return this.find({ _id: tid }, callback);
});
module.exports.Thing = mongoose.model('Thing', ThingSchema);

var IndexSchema = new mongoose.Schema({
    tid: { type: mongoose.Schema.Types.ObjectId, required: true },//, ref: 'thing'
    category: { type: String, required: true, enum: ENUM_CATEGORY },
    source: { type: String, required: true, enum: ENUM_SOURCE },
    sourcekey: { type: Object, required: true, default: {} },
    creator: { type: String, required: true },
    createtime: { type: Date, required: true, default: Date.now },
    updatetime: { type: Date, required: true, default: Date.now }
}, { collection: 'index' });
IndexSchema.static('findAll', function (callback) {
    return this.find(callback);
});
IndexSchema.static('findByT', function (tid, callback) {
    return this.find({ tid: tid }, callback);
});
IndexSchema.static('findByIs', function (iids, callback) {
    return this.find({ _id: { $in: iids } }, callback);
});
module.exports.Index = mongoose.model('Index', IndexSchema);

var IndexValueSchema = new mongoose.Schema({
    iid: { type: mongoose.Schema.Types.ObjectId, required: true },//, ref: 'index'
    datetime: { type: Date, required: true },
    category: { type: String, required: true, enum: ENUM_CATEGORY },
    source: { type: String, required: true, enum: ENUM_SOURCE },
    sourcekey: { type: Object, required: true, default: {} },
    value: { type: Object, required: true, default: {} },
    elapsed: { type: Number, required: true, default: 0 },
    creator: { type: String, required: true },
    createtime: { type: Date, required: true, default: Date.now },
    updatetime: { type: Date, required: true, default: Date.now }
}, { collection: 'indexvalue' })
IndexValueSchema.static('findByI', function (iid, callback) {
    return this.find({ iid: iid })
        .exec(callback);
});
IndexValueSchema.static('findByIs', function (iids, callback) {
    return this.find({ iid: { $in: iids } }, callback);
});
IndexValueSchema.static('findByIAndTimerange', function (iid, beginTime, endTime, callback) {
    return this.find({ iid: iid, datetime: { '$gte': beginTime, '$lte': endTime }})
        .sort({ datetime: 'asc' })
        .exec(callback);
});
IndexValueSchema.static('findByIsAndTimerange', function (iids, beginTime, endTime, callback) {
    return this.find({ iid: { $in: iids }, datetime: { '$gte': beginTime, '$lte': endTime }})
        .sort({ datetime: 'asc' })
        .exec(callback);
});
IndexValueSchema.static('findNewestByI', function (iid, callback) {
    return this.find({ iid: iid })
        .sort({ datetime: 'desc' })
        .limit(1)
        .exec(callback);
});
module.exports.IndexValue = mongoose.model('IndexValue', IndexValueSchema);

var GroupSchema = new mongoose.Schema({
    title: { type: String, required: true },
    tags: { type: Array, required: false, default: [] },
    indexs: { type: Array, required: true, default: [] },
    creator: { type: String, required: true },
    createtime: { type: Date, required: true, default: Date.now },
    updatetime: { type: Date, required: true, default: Date.now }
}, { collection: 'group' });
GroupSchema.static('findAll', function (callback) {
    return this.find(callback);
});
GroupSchema.static('findByG', function (gid, callback) {
    return this.find({ _id: gid }, callback);
});
module.exports.Group = mongoose.model('Group', GroupSchema);
