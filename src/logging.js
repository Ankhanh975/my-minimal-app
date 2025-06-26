import Realm from 'realm';

// 1. Define your schema
const SensorLogSchema = {
  name: 'SensorLog',
  properties: {
    _id: 'int',
    timestamp: 'int',
    ax: 'float',
    ay: 'float',
    az: 'float',
  },
  primaryKey: '_id',
};

// 2. Open the Realm
const realm = await Realm.open({ schema: [SensorLogSchema] });

// 3. Write data
realm.write(() => {
  realm.create('SensorLog', {
    _id: Date.now(),
    timestamp: Date.now(),
    ax: 1.23,
    ay: 4.56,
    az: 7.89,
  });
});

// 4. Query data
const logs = realm.objects('SensorLog');