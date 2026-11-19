import { Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import { useEffect, useState } from 'react';
import { AlertModal } from '../../components/AlertModal';
import { colors } from '../../constants/colors';
import { Alert, connectToAlerts } from '../../services/alerts';

export default function TabsLayout() {
  const [alert, setAlert] = useState<Alert | null>(null);

  useEffect(() => {
    const disconnect = connectToAlerts({
      // Se já tem um pop-up aberto, não abre outro por cima
      onAlert: (newAlert) => setAlert((current) => current ?? newAlert),
      // A água baixou: fecha o pop-up
      onCleared: () => setAlert(null),
    });
    return disconnect;
  }, []);
  
    return (
    <>
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarActiveTintColor: colors.primary,
          tabBarInactiveTintColor: colors.textSecondary,
          tabBarLabelStyle: { fontSize: 13, fontWeight: '600' },
        }}
      >
        <Tabs.Screen
          name="home"
          options={{
            title: 'Início',
            tabBarIcon: ({ color, size }) => <Ionicons name="home-outline" color={typeof color === 'number' || color === null ? undefined : color} size={size} />,
          }}
        />
        <Tabs.Screen
          name="contacts"
          options={{
            title: 'Contatos',
            tabBarIcon: ({ color, size }) => <Ionicons name="people-outline" color={typeof color === 'number' || color === null ? undefined : color} size={size} />,
          }}
        />
        <Tabs.Screen
          name="profile"
          options={{
            title: 'Perfil',
            tabBarIcon: ({ color, size }) => <Ionicons name="person-outline" color={typeof color === 'number' || color === null ? undefined : color} size={size} />,
          }}
        />
      </Tabs>

      <AlertModal
        alert={alert}
        onSafe={() => setAlert(null)}
        onNeedHelp={() => setAlert(null)}
      />
    </>
  );
}