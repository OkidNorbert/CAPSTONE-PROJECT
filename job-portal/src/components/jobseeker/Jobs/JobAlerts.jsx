import React, { useState } from 'react';
import Card from '../../shared/UI/Card';
import Button from '../../shared/UI/Button';
import InputField from '../../shared/Forms/InputField';

const JobAlerts = () => {
  const [alerts] = useState([
    {
      id: 1,
      title: 'React Developer Jobs',
      keywords: 'React, JavaScript, Frontend',
      location: 'Remote',
      frequency: 'Daily'
    },
    {
      id: 2,
      title: 'UX Design Positions',
      keywords: 'UX, UI, Design',
      location: 'New York',
      frequency: 'Weekly'
    }
  ]);

  const [showNewAlert, setShowNewAlert] = useState(false);
  const [newAlert, setNewAlert] = useState({
    title: '',
    keywords: '',
    location: '',
    frequency: 'Daily'
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Job Alerts</h2>
        <Button onClick={() => setShowNewAlert(true)}>Create Alert</Button>
      </div>

      {showNewAlert && (
        <Card>
          <form className="space-y-4">
            <InputField
              label="Alert Title"
              name="title"
              value={newAlert.title}
              onChange={(e) => setNewAlert({...newAlert, title: e.target.value})}
              required
            />
            <InputField
              label="Keywords"
              name="keywords"
              value={newAlert.keywords}
              onChange={(e) => setNewAlert({...newAlert, keywords: e.target.value})}
              placeholder="e.g., React, JavaScript, Frontend"
              required
            />
            <InputField
              label="Location"
              name="location"
              value={newAlert.location}
              onChange={(e) => setNewAlert({...newAlert, location: e.target.value})}
              placeholder="e.g., Remote, New York"
            />
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Frequency
              </label>
              <select
                value={newAlert.frequency}
                onChange={(e) => setNewAlert({...newAlert, frequency: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="Daily">Daily</option>
                <option value="Weekly">Weekly</option>
                <option value="Monthly">Monthly</option>
              </select>
            </div>
            <div className="flex justify-end space-x-4">
              <Button type="button" variant="outline" onClick={() => setShowNewAlert(false)}>
                Cancel
              </Button>
              <Button type="submit">Create Alert</Button>
            </div>
          </form>
        </Card>
      )}

      <div className="space-y-4">
        {alerts.map((alert) => (
          <Card key={alert.id}>
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-lg font-semibold">{alert.title}</h3>
                <div className="mt-2 space-y-1">
                  <p className="text-sm text-gray-500">🔍 Keywords: {alert.keywords}</p>
                  <p className="text-sm text-gray-500">📍 Location: {alert.location}</p>
                  <p className="text-sm text-gray-500">🔄 Frequency: {alert.frequency}</p>
                </div>
              </div>
              <div className="space-x-2">
                <Button variant="outline" size="sm">Edit</Button>
                <Button variant="outline" size="sm">Delete</Button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default JobAlerts;