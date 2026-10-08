"""Reproducible local classifier. Dataset: UCI SMS Spam Collection, CC BY 4.0."""
from pathlib import Path
import zipfile, re, unicodedata, json, hashlib
import numpy as np
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression
from sklearn.model_selection import train_test_split
from sklearn.metrics import precision_score, recall_score, f1_score, confusion_matrix, average_precision_score, brier_score_loss
ROOT=Path(__file__).resolve().parents[1]
def normalize(s): return unicodedata.normalize('NFKC',s).lower()
def tokenize(s): return re.findall(r'[a-z0-9]{2,}',normalize(s))
def main():
 data=zipfile.ZipFile(ROOT/'ml/sms.zip').read('SMSSpamCollection').decode('utf-8')
 rows={}
 for line in data.splitlines():
  label,msg=line.split('\t',1); key=' '.join(tokenize(msg)); y=int(label=='spam')
  if key in rows and rows[key][1]!=y: raise ValueError('Conflicting duplicate labels')
  rows[key]=(msg,y)
 X,y=zip(*rows.values()); y=np.array(y)
 train,test=train_test_split(np.arange(len(y)),test_size=.2,stratify=y,random_state=42)
 v=TfidfVectorizer(tokenizer=tokenize,token_pattern=None,lowercase=False,ngram_range=(1,2),min_df=2,sublinear_tf=True)
 Xt=v.fit_transform([X[i] for i in train]); Xv=v.transform([X[i] for i in test])
 model=LogisticRegression(C=8,max_iter=1000,random_state=42).fit(Xt,y[train]); p=model.predict_proba(Xv)[:,1]; pred=p>=.5
 metrics={'dataset':'UCI SMS Spam Collection','license':'CC BY 4.0','dataset_sha256':hashlib.sha256(data.encode()).hexdigest(),'raw_rows':len(data.splitlines()),'unique_rows':len(y),'train_rows':len(train),'test_rows':len(test),'train_spam':int(y[train].sum()),'test_spam':int(y[test].sum()),'seed':42,'deduplication':'NFKC + lowercase + ASCII word tokens; before split','features':len(v.vocabulary_),'precision':float(precision_score(y[test],pred)),'recall':float(recall_score(y[test],pred)),'f1':float(f1_score(y[test],pred)),'average_precision':float(average_precision_score(y[test],p)),'brier_score':float(brier_score_loss(y[test],p)),'confusion_matrix_tn_fp_fn_tp':confusion_matrix(y[test],pred).tolist(),'threshold':.5,'limitations':['Historical English SMS, not a modern fraud benchmark.','Spam probability does not measure authenticity or safety.','Only exact normalized duplicates removed; near duplicates may remain.','No user study or demonstrated fraud reduction.']}
 artifact={'version':'1.0.0','vocabulary':v.vocabulary_,'idf':v.idf_.tolist(),'weights':model.coef_[0].tolist(),'intercept':float(model.intercept_[0]),'metrics':metrics}
 (ROOT/'public/model.json').write_text(json.dumps(artifact,separators=(',',':')))
 (ROOT/'docs/evaluation.json').write_text(json.dumps(metrics,indent=2))
 fixtures=[{'text':X[i],'probability':float(q)} for i,q in zip(test,p)]
 (ROOT/'tests/parity.json').write_text(json.dumps(fixtures))
 print(json.dumps(metrics,indent=2))
if __name__=='__main__': main()
