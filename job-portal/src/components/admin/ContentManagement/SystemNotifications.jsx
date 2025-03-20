import React, { useState } from 'react';
import Card from '../../shared/UI/Card';
import Button from '../../shared/UI/Button';
import InputField from '../../shared/Forms/InputField';

const SystemNotifications = () => {
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      title: 'System Maintenance',
      message: 'System will be down for maintenance on Saturday',
      type: 'warning',
      active: true
    },
    {
      id: 2,
      title: 'New Feature',
      message: 'Check out our new messaging system',
      type: 'info',
      active: true
    }
  ]);

  const [newNotification, setNewNotification] = useState({
    title: '',
    message: '',
    type: 'info'
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    const notification = {
      id: Date.now(),
      ...newNotification,
      active: true
    };
    setNotifications([...notifications, notification]);
    setNewNotification({ title: '', message: '', type: 'info' });
  };

  return (
    <div className="space-y-6">
      <Card title="Create Notification">
        <form onSubmit={handleSubmit} className="space-y-4">
          <InputField
            label="Title"
            name="title"
            value={newNotification.title}
            onChange={(e) => setNewNotification({
              ...newNotification,
              title: e.target.value
            })}
            required
          />
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Message
            </label>
            <textarea
              value={newNotification.message}
              onChange={(e) => setNewNotification({
                ...newNotification,
                message: e.target.value
              })}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Type
            </label>
            <select
              value={newNotification.type}
              onChange={(e) => setNewNotification({
                ...newNotification,
                type: e.target.value
              })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            >
              <option value="info">Info</option>
              <option value="warning">Warning</option>
              <option value="error">Error</option>
            </select>
          </div>

          <div className="flex justify-end">
            <Button type="submit">Create Notification</Button>
          </div>
        </form>
      </Card>

      <Card title="Active Notifications">
        <div className="space-y-4">
          {notifications.map((notification) => (
            <div
              key={notification.id}
              className={`p-4 rounded-md ${
                notification.type === 'warning' ? 'bg-yellow-50' :
                notification.type === 'error' ? 'bg-red-50' :
                'bg-blue-50'
              }`}
            >
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-medium">{notification.title}</h3>
                  <p className="text-sm mt-1">{notification.message}</p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setNotifications(notifications.filter(n => n.id !== notification.id));
                  }}
                >
                  Remove
                </Button>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};

export default SystemNotifications;