import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../constants/colors';

export default function TabsLayout() {
  return (
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
        name="profile"
        options={{
          title: 'Perfil',
          tabBarIcon: ({ color, size }) => <Ionicons name="person-outline" color={typeof color === 'number' || color === null ? undefined : color} size={size} />,
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
        name="dependents"
        options={{
          title: 'Dependentes',
          tabBarIcon: ({ color, size }) => <Ionicons name="people-circle-outline" color={typeof color === 'number' || color === null ? undefined : color} size={size} />,
        }}
      />
    </Tabs>
  );
}