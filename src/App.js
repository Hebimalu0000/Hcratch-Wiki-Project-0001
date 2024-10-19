import React, { useState, useEffect } from 'react';
import { getDoc, doc, setDoc } from 'firebase/firestore';
import { signInWithEmailAndPassword, onAuthStateChanged } from 'firebase/auth';
import { db, auth } from './firebase';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { dark } from 'react-syntax-highlighter/dist/esm/styles/prism';

const App = () => {
    const [content, setContent] = useState('');
    const [markdown, setMarkdown] = useState('');
    const [isAdmin, setIsAdmin] = useState(false);
    const [user, setUser] = useState(null);

    // ユーザーがログインしているか確認
    useEffect(() => {
        onAuthStateChanged(auth, async (currentUser) => {
            if (currentUser) {
                setUser(currentUser);
                // Adminかどうかを確認する
                const userRef = doc(db, 'users', currentUser.uid);
                const userSnap = await getDoc(userRef);
                if (userSnap.exists() && userSnap.data().role === 'admin') {
                    setIsAdmin(true);
                }
            } else {
                setUser(null);
                setIsAdmin(false);
            }
        });
    }, []);

    // Firestoreからページコンテンツを取得
    useEffect(() => {
        const fetchPageContent = async () => {
            const docRef = doc(db, 'pages', 'wiki-page');
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
                setContent(docSnap.data().content);
            } else {
                console.log("No such document!");
            }
        };
        fetchPageContent();
    }, []);

    // ページをFirestoreに保存
    const savePage = async () => {
        const docRef = doc(db, 'pages', 'wiki-page');
        await setDoc(docRef, { content: markdown, lastEdited: new Date() });
        setContent(markdown); // 更新内容を即座に反映
    };

    // ログイン処理
    const handleLogin = async () => {
        try {
            await signInWithEmailAndPassword(auth, 'admin@example.com', 'password123');
        } catch (error) {
            console.error("Login error", error);
        }
    };

    return (
        <div>
            <h1>Markdown Wiki</h1>

            {user ? (
                <div>
                    {isAdmin ? (
                        <div>
                            <textarea
                                value={markdown}
                                onChange={(e) => setMarkdown(e.target.value)}
                                rows="10"
                                cols="80"
                                placeholder="Markdown形式で編集してください"
                            />
                            <button onClick={savePage}>Save Page</button>
                        </div>
                    ) : (
                        <p>閲覧のみ可能です。</p>
                    )}

                    <h2>Preview</h2>
                    <ReactMarkdown
                        components={{
                            code({ node, inline, className, children, ...props }) {
                                const match = /language-(\w+)/.exec(className || '')
                                return !inline && match ? (
                                    <SyntaxHighlighter style={dark} language={match[1]} PreTag="div" {...props}>
                                        {String(children).replace(/\n$/, '')}
                                    </SyntaxHighlighter>
                                ) : (
                                    <code className={className} {...props}>
                                        {children}
                                    </code>
                                )
                            }
                        }}
                    >
                        {content}
                    </ReactMarkdown>
                </div>
            ) : (
                <div>
                    <button onClick={handleLogin}>Login as Admin</button>
                </div>
            )}
        </div>
    );
};

export default App;