const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://uqhrpucpeajenxuxghqo.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVxaHJwdWNwZWFqZW54dXhnaHFvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzY1MTg3NzEsImV4cCI6MjA5MjA5NDc3MX0.6TL2c-AO87R6QV1H61OK7Gjyt_wpzQwIw3GdyQWiqRQ';

const supabase = createClient(supabaseUrl, supabaseKey);

async function test() {
    const { data: guests, error: err1 } = await supabase.from('wedding_guests').select('*').limit(1);
    console.log('Guests:', guests, err1);

    const { data: memories, error: err2 } = await supabase.from('memories').select('*').limit(1);
    console.log('Memories:', memories, err2);
}

test();
