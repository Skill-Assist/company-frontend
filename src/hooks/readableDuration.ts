export function useReadableDuration(durationInHours: number) {
  let readableDuration = '';

  if (durationInHours) {
    const hours = durationInHours.toString().split('.')[0];
    const minutes = durationInHours
      .toString()
      .split('.')[1]
      ?.padEnd(2, '0');

    let hoursText = '';

    if (hours === '1') {
      hoursText = 'hora';
    } else {
      hoursText = 'horas';
    }

    let minutesText = '';

    if (minutes === '01') {
      minutesText = 'minuto';
    } else {
      minutesText = 'minutos';
    }

    readableDuration = `${hours} ${hoursText} ${
      minutes !== '00' && minutes !== undefined ? `e ${minutes} ${minutesText}` : ''
    }`;
  }

  return readableDuration;
}