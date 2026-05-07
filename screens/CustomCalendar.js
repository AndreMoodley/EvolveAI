import React, { useContext, useMemo, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { CalendarList } from 'react-native-calendars';
import moment from 'moment';
import { Tokens, getTheme } from '../constants/styles';
import { useTheme } from '../store/theme-context';
import { CalendarContext } from '../store/calendar-context';
import { useVoid } from '../store/void-context';
import { getFormattedDate } from '../util/date';
import GradientCard from '../components/UI/GradientCard';
import PressableScale from '../components/UI/PressableScale';
import SectionHeader from '../components/UI/SectionHeader';
import EmptyState from '../components/UI/EmptyState';

function CustomCalendar({ navigation }) {
  const { theme } = useTheme();
  const t = getTheme(theme);
  const calendarCtx = useContext(CalendarContext);
  const voidCtx = useVoid();
  const [selectedDate, setSelectedDate] = useState(getFormattedDate(new Date()));

  const sessions = voidCtx.state.sessions || [];
  const leaks = voidCtx.state.leaks || [];

  const markedDates = useMemo(() => {
    const marks = {};
    (calendarCtx.vows || []).forEach((v) => {
      const k = getFormattedDate(v.date);
      marks[k] = { ...(marks[k] || {}), marked: true, dotColor: t.accent };
    });
    sessions.forEach((s) => {
      const k = s.date;
      marks[k] = { ...(marks[k] || {}), marked: true, dotColor: t.ki };
    });
    leaks.forEach((l) => {
      const k = (l.at || '').slice(0, 10);
      if (k) marks[k] = { ...(marks[k] || {}), dotColor: t.error, marked: true };
    });
    marks[selectedDate] = {
      ...(marks[selectedDate] || {}),
      selected: true,
      selectedColor: t.primary,
    };
    return marks;
  }, [calendarCtx.vows, sessions, leaks, selectedDate, t]);

  const sessionsForDay = sessions.filter((s) => s.date === selectedDate);
  const leaksForDay = leaks.filter((l) => (l.at || '').slice(0, 10) === selectedDate);
  const vowsForDay = (calendarCtx.vows || []).filter(
    (v) => getFormattedDate(v.date) === selectedDate,
  );

  const isToday = selectedDate === getFormattedDate(new Date());
  const onePercent = sessionsForDay.length > 0 || voidCtx.state.todayHammerCount > 0;

  return (
    <ScrollView
      style={{ backgroundColor: t.background }}
      contentContainerStyle={styles.container}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.header}>
        <Text style={[Tokens.font.label, { color: t.accent }]}>Phase IV · 1% Daily Rule</Text>
        <Text style={[Tokens.font.display, { color: t.textPrimary, marginTop: 4 }]}>The Ledger</Text>
        <Text style={[Tokens.font.body, { color: t.textSecondary, marginTop: 8, lineHeight: 21 }]}>
          Negative cultivation is regression. The 1% daily rule is binary. Either you advanced today, or you slipped a layer.
        </Text>
      </View>

      <View style={[styles.calendarWrap, { backgroundColor: t.surface, borderColor: t.hairline }]}>
        <CalendarList
          horizontal
          pagingEnabled
          onDayPress={(d) => setSelectedDate(d.dateString)}
          markedDates={markedDates}
          calendarHeight={340}
          theme={{
            backgroundColor: t.surface,
            calendarBackground: t.surface,
            textSectionTitleColor: t.textTertiary,
            dayTextColor: t.textPrimary,
            todayTextColor: t.accent,
            selectedDayBackgroundColor: t.primary,
            selectedDayTextColor: t.textPrimary,
            monthTextColor: t.textPrimary,
            indicatorColor: t.accent,
            arrowColor: t.accent,
            textDayFontWeight: '500',
            textMonthFontWeight: '800',
            textDayHeaderFontWeight: '700',
            textDayFontSize: 14,
            textMonthFontSize: 16,
            textDayHeaderFontSize: 11,
          }}
        />
      </View>

      <SectionHeader
        label={isToday ? 'Today' : moment(selectedDate).format('dddd')}
        title={moment(selectedDate).format('MMMM D, YYYY')}
        right={
          isToday && (
            <View
              style={[
                styles.statusPill,
                { borderColor: onePercent ? t.jade : t.error, backgroundColor: t.surface },
              ]}
            >
              <Ionicons
                name={onePercent ? 'arrow-up-circle' : 'arrow-down-circle'}
                size={14}
                color={onePercent ? t.jade : t.error}
              />
              <Text
                style={[
                  Tokens.font.label,
                  { color: onePercent ? t.jade : t.error, marginLeft: 4, fontSize: 10 },
                ]}
              >
                {onePercent ? '+1%' : 'No movement'}
              </Text>
            </View>
          )
        }
      />

      {sessionsForDay.length > 0 && (
        <>
          <Text style={[Tokens.font.label, { color: t.textTertiary, marginBottom: 8 }]}>VOID SESSIONS</Text>
          {sessionsForDay.map((s) => (
            <GradientCard
              key={s.id}
              colors={[t.surfaceTop, t.surface]}
              style={{ marginBottom: 8 }}
            >
              <View style={styles.row}>
                <Ionicons name="flash-outline" size={18} color={t.ki} />
                <Text style={[Tokens.font.h3, { color: t.textPrimary, marginLeft: 10, flex: 1 }]}>
                  {s.description || 'Void Session'}
                </Text>
                {s.rating != null && (
                  <View style={[styles.ratingPill, { borderColor: t.accent }]}>
                    <Text style={[Tokens.font.mono, { color: t.accent }]}>{Number(s.rating).toFixed(1)}</Text>
                  </View>
                )}
              </View>
              {s.note ? (
                <Text style={[Tokens.font.body, { color: t.textSecondary, marginTop: 6 }]}>{s.note}</Text>
              ) : null}
            </GradientCard>
          ))}
        </>
      )}

      {vowsForDay.length > 0 && (
        <>
          <Text style={[Tokens.font.label, { color: t.textTertiary, marginTop: 12, marginBottom: 8 }]}>
            VOWS RESOLVING
          </Text>
          {vowsForDay.map((v) => (
            <PressableScale
              key={v.id}
              onPress={() => navigation.navigate('VowDetail', { vow: v })}
              style={{ marginBottom: 8 }}
            >
              <GradientCard colors={[t.surfaceTop, t.surface]} borderColor={t.accent}>
                <View style={styles.row}>
                  <Ionicons name="diamond" size={16} color={t.accent} />
                  <Text style={[Tokens.font.h3, { color: t.textPrimary, marginLeft: 10, flex: 1 }]}>
                    {v.title}
                  </Text>
                  <Ionicons name="chevron-forward" size={18} color={t.textTertiary} />
                </View>
              </GradientCard>
            </PressableScale>
          ))}
        </>
      )}

      {leaksForDay.length > 0 && (
        <>
          <Text style={[Tokens.font.label, { color: t.error, marginTop: 12, marginBottom: 8 }]}>
            KI LEAKS · {leaksForDay.length}
          </Text>
          {leaksForDay.slice(0, 6).map((l) => (
            <View
              key={l.id}
              style={[styles.leakRow, { backgroundColor: t.surface, borderColor: t.hairline }]}
            >
              <Ionicons name="alert-circle-outline" size={14} color={t.error} />
              <Text style={[Tokens.font.body, { color: t.textSecondary, marginLeft: 8, flex: 1 }]}>{l.label}</Text>
              <Text style={[Tokens.font.label, { color: t.textTertiary, fontSize: 10 }]}>
                {moment(l.at).format('h:mm a')}
              </Text>
            </View>
          ))}
        </>
      )}

      {sessionsForDay.length === 0 && vowsForDay.length === 0 && leaksForDay.length === 0 && (
        <EmptyState
          icon="moon-outline"
          title="Empty Day"
          body={
            isToday
              ? 'Log a void session, strike a vow, or seal a leak. Stagnation is regression.'
              : 'Nothing inscribed for this day.'
          }
        />
      )}

      {isToday && (
        <PressableScale
          onPress={() => navigation.navigate('VoidSession')}
          style={[styles.fab, { backgroundColor: t.primary, borderColor: t.primaryGlow }]}
        >
          <Ionicons name="add" size={22} color={t.textPrimary} />
          <Text style={[Tokens.font.h3, { color: t.textPrimary, marginLeft: 8 }]}>Log Void Session</Text>
        </PressableScale>
      )}

      <View style={{ height: 80 }} />
    </ScrollView>
  );
}

export default CustomCalendar;

const styles = StyleSheet.create({
  container: { padding: Tokens.spacing.lg, paddingTop: 64 },
  header: { marginBottom: Tokens.spacing.lg },
  calendarWrap: {
    borderRadius: Tokens.radius.lg,
    borderWidth: 1,
    overflow: 'hidden',
  },
  row: { flexDirection: 'row', alignItems: 'center' },
  ratingPill: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: Tokens.radius.pill,
    borderWidth: 1,
  },
  statusPill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: Tokens.radius.pill,
    borderWidth: 1,
  },
  leakRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: Tokens.radius.md,
    borderWidth: 1,
    marginBottom: 6,
  },
  fab: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: Tokens.radius.pill,
    borderWidth: 1.5,
    marginTop: Tokens.spacing.xl,
  },
});
