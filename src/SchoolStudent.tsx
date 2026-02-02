import logo from './assets/logicbox.svg';

const SchoolStudent = () => {
    const styles = {
        wrapper: {
            minHeight: '100vh',
            display: 'flex',
            flexDirection: 'column' as const,
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#fff7ed',
            padding: '20px',
            fontFamily: "'Plus Jakarta Sans', sans-serif"
        },
        card: {
            width: '100%',
            maxWidth: '500px',
            backgroundColor: '#ffffff',
            padding: '40px',
            borderRadius: '24px',
            border: '1px solid #fed7aa',
            boxShadow: '0 25px 50px -12px rgba(249, 115, 22, 0.15)',
            display: 'flex',
            flexDirection: 'column' as const,
            gap: '16px'
        },
        input: {
            width: '100%',
            backgroundColor: '#ffffff',
            border: '1px solid #cbd5e1',
            borderRadius: '12px',
            padding: '14px 16px',
            color: '#1e293b',
            fontSize: '1rem',
            outline: 'none',
            boxSizing: 'border-box' as const,
        },
        button: {
            width: '100%',
            backgroundColor: '#f97316',
            color: 'white',
            padding: '14px',
            borderRadius: '12px',
            fontWeight: '600',
            fontSize: '1rem',
            border: 'none',
            cursor: 'pointer',
            marginTop: '12px'
        }
    };

    return (
        <div style={styles.wrapper}>
            <div style={styles.card}>
                <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '10px' }}>
                    <img src={logo} alt="LogicBox Logo" style={{ height: '50px' }} />
                </div>
                <h1 style={{ color: '#1e293b', textAlign: 'center', margin: '0 0 20px 0' }}>School Student</h1>
                <input style={styles.input} type="text" placeholder="Enter your name" />
                <input style={styles.input} type="text" placeholder="Enter your school name" />
                <input style={styles.input} type="text" placeholder="Enter your password" />
                <input style={styles.input} type="number" placeholder="Enter your parent phone number" />
                <input style={styles.input} type="text" placeholder="Enter your standard" />
                <input style={styles.input} type="number" placeholder="Enter your address" />
                <input style={styles.input} type="text" placeholder="Enter referral code" />
                <input style={styles.input} type="text" placeholder="Enter your feedback details" />
                <button style={styles.button} onClick={() => console.log("Submitted")}>Submit</button>
            </div>
        </div>
    )
}

export default SchoolStudent