import React, { useContext, useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import moment from 'moment';
import { Tokens, getTheme } from '../constants/styles';
import { useTheme } from '../store/theme-context';
import { CalendarContext } from '../store/calendar-context';
import { AuthContext } from '../store/auth-context';
import GradientCard from '../components/UI/GradientCard';
import PressableScale from '../components/UI/PressableScale';
import SectionHeader from '../components/UI/SectionHeader';

function BindingVowForm({ navigation }) {
  const { theme } = useTheme();
  const t = getTheme(theme);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState(moment().add(60, 'days').toDate());
  const [type, setType] = useState('major');
  const [pickerVisible, setPickerVisible] = useState(false);
  const calendarCtx = useContext(CalendarContext);
  const authCtx = useContext(AuthContext);

  const submit = async () => {
    if (!title.trim() || !description.trim()) {
      Alert.alert('Incomplete Vow', 'Both title and description are required.');
      return;
    }
    const selected = moment(date);
    if (selected.isBefore(moment(), 'day')) {
      Alert.alert('Invalid Horizon', 'Vows cannot be inscribed into the past.');
      return;
    }
    const minMajor = moment().add(2, 'months');
    if (type === 'major' && selected.isBefore(minMajor)) {
      Alert.alert('Major Vow Too Short', 'Major vows must extend at least 2 months into the future.');
      return;
    }
    if (type === 'minor' && selected.isAfter(minMajor)) {
      Alert.alert('Minor Vow Too Long', 'Minor vows must resolve within 2 months.');
      return;
    }
    const vow = {
      title: title.trim(),
      description: description.trim(),
      date: date.toISOString(),
      startDate: new Date().toISOString(),
      type,
    };
    await calendarCtx.addVow(vow, authCtx.token, authCtx.userId);
    navigation.goBack();
  };

  const accent = type === 'major' ? t.accent : t.ki;

  return (
    <ScrollView
      style={{ backgroundColor: t.background }}
      contentContainerStyle={styles.container}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.header}>
        <Text style={[Tokens.font.label, { color: accent }]}>Inscribe a Vow</Text>
        <Text style={[Tokens.font.display, { color: t.textPrimary, marginTop: 4 }]}>Binding Contract</Text>
        <Text style={[Tokens.font.body, { color: t.textSecondary, marginTop: 8, lineHeight: 21 }]}>
          The strictness of the vow correlates to the magnitude of the result. Choose stakes you cannot ignore.
        </Text>
      </View>

      <View style={styles.toggleRow}>
        {[
          { id: 'major', label: 'Major', icon: 'diamond', color: t.accent },
          { id: 'minor', label: 'Minor', icon: 'leaf-outline', color: t.ki },
        ].map((opt) => {
          const active = type === opt.id;
          return (
            <PressableScale
              key={opt.id}
              onPress={() => setType(opt.id)}
              style={[
                styles.toggleBtn,
                {
                  backgroundColor: active ? t.surfaceHi : t.surface,
                  borderColor: active ? opt.color : t.hairline,
                },
              ]}
            >
              <Ionicons name={opt.icon} size={18} color={active ? opt.color : t.textTertiary} />
              <Text
                style={[
                  Tokens.font.h3,
                  { color: active ? t.textPrimary : t.textTertiary, marginLeft: 8 },
                ]}
              >
                {opt.label}
              </Text>
            </PressableScale>
          );
        })}
      </View>

      <SectionHeader label="Title" title="What will you bind to?" accent={accent} />
      <View style={[styles.field, { backgroundColor: t.surface, borderColor: t.hairline }]}>
        <TextInput
          value={title}
          onChangeText={setTitle}
          placeholder="e.g. 90lb Strict Muscle-Up"
          placeholderTextColor={t.textTertiary}
          style={[Tokens.font.h3, { color: t.textPrimary }]}
        />
      </View>

      <SectionHeader label="Description" title="The terms of the contract" accent={accent} />
      <View style={[styles.field, styles.fieldTall, { backgroundColor: t.surface, borderColor: t.hairline }]}>
        <TextInput
          value={description}
          onChangeText={setDescription}
          placeholder="The exact movement standard, the daily ritual, the punishment for failure."
          placeholderTextColor={t.textTertiary}
          multiline
          style={[Tokens.font.body, { color: t.textPrimary, lineHeight: 22, textAlignVertical: 'top' }]}
        />
      </View>

      <SectionHeader label="Horizon" title="Resolution Date" accent={accent} />
      <PressableScale onPress={() => setPickerVisible(true)}>
        <GradientCard colors={[t.surfaceTop, t.surface]}>
          <View style={styles.dateRow}>
            <Ionicons name="calendar-outline" size={20} color={accent} />
            <View style={{ flex: 1, marginLeft: 12 }}>
              <Text style={[Tokens.font.label, { color: t.textTertiary }]}>Resolution</Text>
              <Text style={[Tokens.font.h2, { color: t.textPrimary, marginTop: 2 }]}>
                {moment(date).format('MMM D, YYYY')}
              </Text>
              <Text style={[Tokens.font.body, { color: t.textTertiary, fontSize: 13 }]}>
                {moment(date).fromNow()}
              </Text>
            </View>
            <Ionicons name="pencil" size={16} color={t.textTertiary} />
          </View>
        </GradientCard>
      </PressableScale>

      <DateTimePickerModal
        isVisible={pickerVisible}
        mode="date"
        onConfirm={(d) => {
          setDate(d);
          setPickerVisible(false);
        }}
        onCancel={() => setPickerVisible(false)}
        minimumDate={new Date()}
        maximumDate={moment().add(2, 'years').toDate()}
      />

      <PressableScale onPress={submit} style={[styles.submit, { backgroundColor: accent }]}>
        <Ionicons name="flame" size={18} color={t.background} />
        <Text style={[Tokens.font.h3, { color: t.background, marginLeft: 8 }]}>
          Bind {type === 'major' ? 'Major' : 'Minor'} Vow
        </Text>
      </PressableScale>

      <Text style={[Tokens.font.body, { color: t.textTertiary, fontSize: 12, marginTop: 12, textAlign: 'center' }]}>
        Major vows require ≥2 months. Minor vows resolve in &lt;2 months. The horizon cannot be the past.
      </Text>

      <View style={{ height: 40 }} />
    </ScrollView>
  );
}

export default BindingVowForm;

const styles = StyleSheet.create({
  container: { padding: Tokens.spacing.lg, paddingTop: 24 },
  header: { marginBottom: Tokens.spacing.lg },
  toggleRow: { flexDirection: 'row', gap: 10 },
  toggleBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: Tokens.radius.md,
    borderWidth: 1.5,
    marginHorizontal: 4,
  },
  field: {
    borderRadius: Tokens.radius.md,
    borderWidth: 1,
    paddingHorizontal: 14,
    paddingVertical: 14,
  },
  fieldTall: { minHeight: 110 },
  dateRow: { flexDirection: 'row', alignItems: 'center' },
  submit: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: Tokens.radius.pill,
    marginTop: Tokens.spacing.xl,
  },
});
