// InsertOne data to the database
export const create = async (model, data) => {
    try {
        const result = await model.create(data);
        if (!result) {
            return { status: false, message: 'Data not created' };
        }
        return { status: true, data: result };
    } catch (err) {
        return { status: false, error: err };
    }
};

// InsertMany data to the database
export const createMany = async (model, dataArray) => {
    try {
        const result = await model.insertMany(dataArray).lean();
        if (!result || result.length === 0) {
            return { status: false, message: 'Data not created' };
        }
        return { status: true, data: result };
    } catch (err) {
        return { status: false, error: err };
    }
};

// FindOne data from the database
export const getOne = async (model, query, projection = null) => {
    try {
        const result = await model.findOne(query, projection).lean();
        if(!result) {
            return { status: false, message: 'No data found' };
        }
        return { status: true, data: result };
    } catch (err) {
        return { status: false, error: err };
    }
};

// FindMany data from the database
export const getMany = async (model, query = {}, projection = null) => {
    try {
        const result = await model.find(query, projection).lean();
        if(result.length === 0) {
            return { status: false, message: 'No data found' };
        }
        return { status: true, data: result };
    } catch (err) {
        return { status: false, error: err };
    }
};

// Update data from the database
export const updateOne = async (model, query, updateData) => {
    try {
        const result = await model.updateOne(query, updateData).lean();
        if (result.nModified === 0) {
            return { status: false, message: 'No data updated' };
        }   
        return { status: true, data: result };
    } catch (err) {
        return { status: false, error: err };
    }
};

// Delete data from the database
export const deleteOne = async (model, query) => {
    try {
        const result = await model.deleteOne(query).lean();
        if (result.deletedCount === 0) {
            return { status: false, message: 'No data deleted' };
        }
        return { status: true, data: result };
    } catch (err) {
        return { status: false, error: err };
    }
};