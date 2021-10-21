import mongoose from 'mongoose';
import beautifyUnique from 'mongoose-beautiful-unique-validation';
import config from '../config';

mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);
mongoose.set('useUnifiedTopology', true);

mongoose.plugin(beautifyUnique);

export default mongoose.createConnection(config.mongodb.uri);
